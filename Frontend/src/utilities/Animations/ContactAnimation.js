import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const ContactAnimation = ()=>{
    useGSAP(
        () => {
    
          let TL = gsap.timeline({
            scrollTrigger: {
              trigger: '.c-main',
              scroller: 'body',
            //   markers:true,
              start: '8% 8%',
              end: 'bottom 25%',
              scrub:2,
              pin:true
            },
          })
          
          TL.from('.ri-code-s-slash-fill',{
            x:-600
          })
          TL.from('.contact',{
            x:-600
          })
          TL.from('.contact-para',{
            x:-900,
            stagger:0.5
          })
          TL.from('.box',{
            x:750,
            stagger:0.2
          })
          TL.from('.box',{
            duration:1
          })

          gsap.to('.box',{
            // transition:"all 0.3s ease"
          })
        }
      );
}

export default ContactAnimation;