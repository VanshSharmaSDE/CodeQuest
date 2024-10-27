import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const LoaderAnimation = ()=>{
    useGSAP(
        () => {
    
          let TL = gsap.timeline()
    
          TL.to('.loader',{
            delay:3,
            opacity:0,
            duration:1
          })
          TL.to('.loader-bar',{
            height:0,
            stagger:0.1
          })
        }
      );
}

export default LoaderAnimation;