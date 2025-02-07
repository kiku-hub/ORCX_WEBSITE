import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * 各ピラミッド層のコンポーネント
 * - 3D形状、マテリアル、アニメーション、インタラクションを管理
 * - 各層のホバー効果とハイライト効果を制御
 */
const PyramidLayer = ({ position, bottomScale, topScale, height, visible, isHighlighted, highlightedLayer, onHover, layerId }) => {
  // レイヤーの状態を管理するref
  const meshRef = useRef();           // 3Dメッシュ全体の参照
  const materialRef = useRef();       // マテリアル（見た目）の参照
  const scaleRef = useRef(visible ? 1 : 0);      // 表示/非表示のスケール
  const opacityRef = useRef(visible ? 0.7 : 0);  // 透明度
  const baseOpacity = 0.7;  // 基本の透明度

  // 各層の色を設定
  const getLayerColor = () => {
    switch (layerId) {
      case 'mission':
        return new THREE.Color(0x48c9b0).multiplyScalar(1.2);  // エメラルド
      case 'vision':
        return new THREE.Color(0x5ca5d9).multiplyScalar(1.2);  // サファイア
      case 'value':
        return new THREE.Color(0x9b6b9e).multiplyScalar(1.2);  // アメジスト
      default:
        return new THREE.Color(0xffffff);
    }
  };

  // 表示/非表示の切り替え時の処理
  useEffect(() => {
    if (!visible) {
      scaleRef.current = 0;
      opacityRef.current = 0;
    }
  }, [visible]);

  // フレームごとのアニメーション更新
  useFrame(() => {
    if (meshRef.current && materialRef.current) {
      // 各層の回転アニメーション
      meshRef.current.rotation.y += 0.005;

      if (visible) {
        // ホバー時の拡大効果
        const targetScale = isHighlighted ? 1.05 : 1;
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1);
        
        // ホバー時の透明度変更
        const targetOpacity = isHighlighted ? 0.95 : baseOpacity;
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, targetOpacity, 0.1);

        // 他の層がハイライトされている時は暗く
        if (!isHighlighted && highlightedLayer !== null) {
          opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0.3, 0.1);
        }
      } else {
        // 非表示時のフェードアウト
        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.1);
        opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, 0.1);
      }

      // 状態の適用
      meshRef.current.scale.setScalar(scaleRef.current);
      materialRef.current.opacity = opacityRef.current;
      meshRef.current.visible = opacityRef.current > 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[0, Math.PI / 6, 0]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onHover(layerId);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
    >
      <cylinderGeometry args={[topScale, bottomScale, height, 3]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color={getLayerColor()}
        transparent={true}
        opacity={baseOpacity}
        metalness={0.2}
        roughness={0.3}
        transmission={0.4}  // 透過性を追加
        thickness={1.0}     // 厚みを追加
        attenuationDistance={0.5}  // 光の減衰距離
        attenuationColor={getLayerColor()}  // 減衰色
        envMapIntensity={1.5}  // 環境マップの強度
        clearcoat={0.3}        // クリアコート
        clearcoatRoughness={0.25}  // クリアコートの粗さ
        ior={1.5}              // 屈折率
        reflectivity={0.2}     // 反射率
        sheen={0.1}            // 光沢
        sheenRoughness={0.3}   // 光沢の粗さ
        sheenColor={getLayerColor()}  // 光沢の色
        side={THREE.DoubleSide}  // 両面を表示
      />
    </mesh>
  );
};

/**
 * ピラミッド全体のグループコンポーネント
 * - 各層の配置とデータ定義
 * - グループ全体の回転アニメーション
 */
const PyramidGroup = ({ visibleLayers, highlightedLayer, onLayerHover }) => {
  const groupRef = useRef();

  // 各層のデータ定義
  const pyramidLayers = [
    {
      id: 'value',    // 最下層: バリュー
      y: -3.65,        // 位置を上に調整
      bottomScale: 6.5,  // 底面の大きさ
      topScale: 4.8,    // 上面の大きさ
      height: 4.0,      // 高さ
      color: 0xb4a7d6   // 色
    },
    {
      id: 'vision',   // 中間層: ビジョン
      y: 0.4,         // 位置を上に調整
      bottomScale: 4.7,
      topScale: 3.0,
      height: 3.8,
      color: 0xa4c9e3
    },
    {
      id: 'mission',  // 最上層: ミッション
      y: 4.4,         // 位置を上に調整
      bottomScale: 2.95,
      topScale: 0,     // 先端を尖らせる
      height: 4.0,
      color: 0x8dd3c7
    }
  ];

  // グループ全体のゆっくりとした回転
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group 
      ref={groupRef} 
      rotation={[0, Math.PI / 6, 0]} 
      position={[0, 0.6, 0]}
      onPointerMissed={() => onLayerHover && onLayerHover(null)}
    >
      {pyramidLayers.map((layer) => (
        <PyramidLayer
          key={layer.id}
          position={[0, layer.y, 0]}
          bottomScale={layer.bottomScale}
          topScale={layer.topScale}
          height={layer.height}
          visible={visibleLayers.includes(layer.id)}
          isHighlighted={highlightedLayer === layer.id}
          highlightedLayer={highlightedLayer}
          onHover={(layerId) => {
            onLayerHover(layerId);
          }}
          layerId={layer.id}
        />
      ))}
    </group>
  );
};

/**
 * メインのThreePyramidコンポーネント
 * - Three.jsのキャンバスとカメラの設定
 * - ライティングの設定
 */
const ThreePyramid = ({ visibleLayers = ['value'], highlightedLayer = null, onLayerHover }) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{
          position: [0, 4.0, 20],  // カメラの高さを上げる
          fov: 45,                 // 画角
          near: 0.1,
          far: 1000
        }}
      >
        {/* ライティング設定 */}
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <ambientLight color={0x404040} />
        
        {/* ピラミッドグループの配置 */}
        <PyramidGroup 
          visibleLayers={visibleLayers} 
          highlightedLayer={highlightedLayer} 
          onLayerHover={onLayerHover} 
        />
      </Canvas>
    </div>
  );
};

export default ThreePyramid;