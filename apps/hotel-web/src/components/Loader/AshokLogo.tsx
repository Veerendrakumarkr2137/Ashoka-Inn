'use client'

import React from 'react'
import Lottie from 'lottie-react'
import logoAnimationData from '../../../public/animations/document_logo_draw_on.json'

export function AshokLogo() {
  return (
    <div className="w-[180px] h-[180px] flex items-center justify-center relative">
      <Lottie
        animationData={logoAnimationData}
        loop={true}
        autoplay={true}
        className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(200,169,106,0.6)]"
      />
    </div>
  )
}
