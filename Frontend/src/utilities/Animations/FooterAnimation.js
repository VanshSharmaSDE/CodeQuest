import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const FooterAnimation = ()=>{
    useGSAP(
        () => {
    
          let TL = gsap.timeline({
            scrollTrigger: {
              trigger: '.f-main',
              scroller: 'body',
              // markers:true,
              start: 'top 85%',
              end: 'bottom bottom',
              scrub:3,
            },
          })
          TL.from('.f-main',{
            opacity:0
          })
          TL.from('.f-background',{
            y:100
          },'a')
          TL.from('.F-info',{
            y:200,
          },'a')
          TL.from('.F-logo',{
            y:200,
          },'a')
          TL.from('.F-content',{
            y:200,
          },'a')
        }
      );
}

export default FooterAnimation;