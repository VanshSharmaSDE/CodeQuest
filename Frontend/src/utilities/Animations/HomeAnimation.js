import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const HomeAnimation = ()=> {
    useGSAP(
        () => {
    
          let TL = gsap.timeline({
            scrollTrigger: {
              trigger: '.h-main',
              scroller: 'body',
              scrub: 2,
              // markers:true,
              start: 'top top',
              end: 'bottom 30%',
            },
          })
    
          TL.to('.n-main', {
            width: "100%",
            position: "fixed",
            top: '4%',
            padding: "0% 10%",
            borderRadius: "0px"
          }, 0)
    
    
          TL.to('.h-background', {
            width: "101%",
            height: "101%"
          }, 0)
    
          gsap.from(".h-main-heading h1", 1.8, {
            y: 610,
            ease: "power4.out",
            delay: 1,
            stagger: 1
          })
    
          gsap.from(".h-main-heading .h-main-paragraph", 1.8, {
            y: 500,
            ease: "power4.out",
            delay: 1.5,
            stagger: 1
          })
    
          gsap.from(".h-main-heading .h-main-button", 1.8, {
            y: 500,
            ease: "power4.out",
            delay: 2,
            stagger: 1
          })
    
          gsap.from('.h-background', {
            opacity: 0,
            ease: "power4.out",
            duration: 1,
            delay: 3
          })
          gsap.from('.n-main', {
            opacity: 0,
            ease: "power4.out",
            duration: 1,
            delay: 3.5
          })
          gsap.from('.dark-profile-button', {
            opacity: 0,
            ease: "power4.out",
            duration: 1,
            delay: 4
          })
          TL.to('.h-background', {
            display: 'none'
          },)
        }
      );
}

export default HomeAnimation;