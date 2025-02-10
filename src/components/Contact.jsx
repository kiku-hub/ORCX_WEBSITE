import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn, textVariant } from "../utils/motion";
import { contactContent } from "../constants";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

const Contact = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    type: "",
    company: "",
    name: "",
    nameKana: "",
    phone: "",
    email: "",
    message: "",
    privacy: false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setForm(prev => ({
      ...prev,
      [name]: newValue
    }));

    // 入力時のエラーチェック
    const newErrors = { ...errors };
    delete newErrors[name];

    // フィールドごとの個別バリデーション
    switch (name) {
      case 'nameKana':
        if (value && !/^[ァ-ヶー\s]*$/.test(value)) {
          newErrors[name] = 'フリガナは全角カタカナで入力してください';
        }
        break;
      case 'phone':
        // 数字とハイフンのみを許可（途中入力を考慮）
        if (value && !/^[0-9\-]*$/.test(value)) {
          newErrors[name] = '電話番号は数字とハイフンのみ使用できます';
        }
        break;
      case 'email':
        // メールアドレスの途中入力を許可
        if (value && !/^[a-zA-Z0-9.@\-_]*$/.test(value)) {
          newErrors[name] = '使用できない文字が含まれています';
        }
        break;
      case 'message':
        if (value && value.length > 1000) {
          newErrors[name] = 'お問い合わせ内容は1000文字以内で入力してください';
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // お問い合わせ種別
    if (!form.type) {
      newErrors.type = 'お問い合わせ種別を選択してください';
    }

    // 会社名/組織名（必須、最大文字数）
    if (!form.company.trim()) {
      newErrors.company = '会社名/組織名を入力してください';
    } else if (form.company.length > 100) {
      newErrors.company = '会社名/組織名は100文字以内で入力してください';
    }

    // お名前（必須、最大文字数）
    if (!form.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    } else if (form.name.length > 50) {
      newErrors.name = 'お名前は50文字以内で入力してください';
    }

    // フリガナ（必須、全角カタカナ）
    if (!form.nameKana.trim()) {
      newErrors.nameKana = 'フリガナを入力してください';
    } else if (!/^[ァ-ヶー\s]+$/.test(form.nameKana)) {
      newErrors.nameKana = 'フリガナは全角カタカナで入力してください';
    } else if (form.nameKana.length > 50) {
      newErrors.nameKana = 'フリガナは50文字以内で入力してください';
    }

    // 電話番号（必須、形式チェック）
    if (!form.phone.trim()) {
      newErrors.phone = '電話番号を入力してください';
    } else {
      const phoneNumber = form.phone.replace(/[-\s]/g, '');
      if (!/^(0[0-9]{9,10})$/.test(phoneNumber)) {
        newErrors.phone = '正しい電話番号の形式で入力してください（例：03-1234-5678）';
      }
    }

    // メールアドレス（必須、形式チェック）
    if (!form.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else {
      // より厳密なメールアドレスの形式チェック
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = '正しいメールアドレスの形式で入力してください';
      } else if (form.email.length > 256) {
        newErrors.email = 'メールアドレスは256文字以内で入力してください';
      }
    }

    // お問い合わせ内容（必須、最小/最大文字数）
    if (!form.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'お問い合わせ内容は10文字以上で入力してください';
    } else if (form.message.length > 1000) {
      newErrors.message = 'お問い合わせ内容は1000文字以内で入力してください';
    }

    // プライバシーポリシー同意
    if (!form.privacy) {
      newErrors.privacy = 'プライバシーポリシーへの同意が必要です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    emailjs
      .send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          from_name_kana: form.nameKana,
          company_name: form.company,
          phone_number: form.phone,
          to_name: "JavaScript Mastery",
          from_email: form.email,
          to_email: "sujata@jsmastery.pro",
          message: form.message,
          inquiry_type: form.type,
        },
        import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setLoading(false);
          alert(contactContent.alerts.success);

          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.error(error);
          alert(contactContent.alerts.error);
        }
      );
  };

  const ErrorMessage = ({ error }) => (
    error ? <p className="text-red-400 text-sm mt-1">{error}</p> : null
  );

  return (
    <div className="relative min-h-screen">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} text-center`}>
          {contactContent.title}
        </p>
        <h2 className={`${styles.sectionHeadText} text-center`}>
          {contactContent.subtitle}
        </h2>
      </motion.div>

      <div className="mt-20 flex items-center justify-center">
        <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex xl:flex-row flex-col-reverse gap-10`}>
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className='flex-[0.85] bg-black-100 p-8 rounded-2xl'
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className='mt-4 flex flex-col gap-8'
            >
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.type.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <select
                  name='type'
                  value={form.type}
                  onChange={handleChange}
                  required
                  className={`bg-tertiary py-4 px-6 text-white rounded-lg outline-none border-2 font-medium
                    ${errors.type ? 'border-red-400' : 'border-transparent'}`}
                >
                  <option value="" disabled>
                    {contactContent.form.type.placeholder}
                  </option>
                  {contactContent.form.type.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ErrorMessage error={errors.type} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.company.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <input
                  type='text'
                  name='company'
                  value={form.company}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.company.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.company ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.company} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.name.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.name.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.name ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.name} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.nameKana.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <input
                  type='text'
                  name='nameKana'
                  value={form.nameKana}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.nameKana.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.nameKana ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.nameKana} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.phone.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <input
                  type='tel'
                  name='phone'
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.phone.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.phone ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.phone} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.email.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.email.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.email ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.email} />
              </label>
              <label className='flex flex-col'>
                <span className='text-white font-medium mb-4'>
                  {contactContent.form.message.label}
                  <span className="text-red-400 ml-1">*</span>
                </span>
                <textarea
                  rows={7}
                  name='message'
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder={contactContent.form.message.placeholder}
                  className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium
                    ${errors.message ? 'border-red-400' : 'border-transparent'}`}
                />
                <ErrorMessage error={errors.message} />
              </label>

              <label className='flex items-center gap-2 cursor-pointer group'>
                <input
                  type='checkbox'
                  name='privacy'
                  checked={form.privacy}
                  onChange={(e) => {
                    setForm({ ...form, privacy: e.target.checked });
                    if (e.target.checked && errors.privacy) {
                      const { privacy, ...restErrors } = errors;
                      setErrors(restErrors);
                    }
                  }}
                  required
                  className={`w-4 h-4 rounded border-2 bg-tertiary text-primary 
                    ${errors.privacy ? 'border-red-400' : 'border-tertiary'}`}
                />
                <span className='text-white text-sm'>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className='text-[#915EFF] hover:underline focus:outline-none'
                  >
                    {contactContent.form.privacy.link}
                  </button>
                  に同意する
                  <span className="text-red-400 ml-1">*</span>
                </span>
              </label>
              <ErrorMessage error={errors.privacy} />

              <button
                type='submit'
                disabled={!form.privacy || loading}
                className={`
                  bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary
                  ${(!form.privacy || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#915EFF] transition-colors'}
                `}
              >
                {loading ? contactContent.form.button.sending : contactContent.form.button.default}
              </button>
            </form>
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className='xl:flex-1 xl:h-[600px] lg:h-[550px] md:h-[500px] h-[350px]'
          >
            <EarthCanvas />
          </motion.div>
        </div>
      </div>

      <PrivacyPolicyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
