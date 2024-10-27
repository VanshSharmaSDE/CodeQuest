import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const AboutAnimation = ()=>{
    useGSAP(
        () => {
    
          let TL = gsap.timeline({
            scrollTrigger: {
              trigger: '.a-main',
              scroller: 'body',
            //   markers:true,
              start: 'top 70%',
              end: '50% 0%',
              scrub:2
            },
          })

          TL.from('.a-main-demo-dashboard',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.line1',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.vision',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.vision-paragraph',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.line2',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.mission',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.circle',{
            x: 1200,
            ease: "power4.out",
            stagger:0.1,
            duration:1
          })
          TL.from('.line3',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.developer',{
            y: 510,
            ease: "power4.out",
          })
          TL.from('.a-main-intro-section',{
            scale:0,
            ease: "power4.out",
          })
        }
      );
}

export default AboutAnimation;