import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const  AboutRouteAnimation = ()=> {
    useGSAP( () => {  
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.about_container',
              scroller: 'body',
              // markers:true, 
              start: '30% 20%',
              end: '60% 25%',
              scrub:2,
             
            },
          }) 
          tl.add("same-time")  
          // gsap.to(".About_codeQuest-main-name h3",{
          //     opacity:0,
          //   scrollTrigger: {
          //     trigger: '.About_codeQuest-main-container',
          //     scroller: 'body',
          //     // markers:true,
          //     start: '5% 1%',
          //     end: '15% 5%',
          //     scrub:2,
          //   },
          // })
          // tl.to(".About_codeQuest-main-text h1",{
          //     fontSize: "6rem",
          //     x:"-100px",
          //     duration:1.5,
          //     y:"-150px",
          //     ease: "sine.inOut"
          // }, "same-time")
          // tl.to(".about_container .About_codeQuest-main-text .lineBar",{         
          //     x:"-560px",
          //     duration:1.5,
          //     y:"-100px",
          //     ease: "sine.inOut"
          // }, "same-time")
          // tl.to(".about_container .About_codeQuest-main-container p",{ 
          //   opacity:1,        
          //     y:"-150",
          //     ease: "sine.inOut"
          // })
          tl.to(".about_container .About_codeQuest-main-container h2",{ 
               opacity:1,      
              y:"150px",     
              ease: "sine.inOut"

          })
          tl.from(".introduction-section .p1",{ 
              opacity :0,  
              y:"-450", 
              duration:1, 
              ease: "sine.inOut",
              scrollTrigger:{
              trigger: '.about_container',
              scroller: 'body',
              // markers:true,
              start: '50% 8%',
              end: '55% 9%',
              scrub:2,
            
              }
          }, "same-time")
        tl.from(".introduction-section .p2",{ 
              opacity :0,  
              y:"450", 
              duration:1, 
              ease: "sine.inOut",
              scrollTrigger:{
              trigger: '.about_container',
              scroller: 'body',
              start: '60% 8%',
              end: '70% 9%',
              scrub:2,

              }     
          },"same-time")
          gsap.to(".svg-slider", {
            transform: "translateX(-200%)",
            scrollTrigger: {
              trigger: '.svg-slider-container',
              scroller: 'body',
              // markers:true,
              start: "-2% 10%",
              end: '100% 35%',    
              scrub:3,
              pin:true
            }
           })

           gsap.to(".meetUp-section h1 ", {
            transform: "translateY(-100px)",
            opacity:1,
            fontSize: "7rem",
            scrollTrigger:{
            trigger: '.meetUp-section',
            scroller: 'body',
            start: '1% 50%',
            // markers:true,
            end: '20% 60%',
            scrub:2,
            }  
           })
           gsap.from(".meetUp-section .developer-info h3", {
            transform: "translateX(-200px)",
            opacity:0,
            fontSize: "rem",
            scrollTrigger:{
            trigger: '.meetUp-section',
            scroller: 'body',
            start: '15% 40%',
            // markers:true,
            end: '25% 50%',
            scrub:2,
            }  
           })
           gsap.to(".meetUp-section .developer-info p", {
            transform: "translateY(-150px)",
            opacity:1,
            scrollTrigger:{
            trigger: '.meetUp-section',
            scroller: 'body',
            start: '20% 40%',
            // markers:true,
            end: '35% 45%',
            scrub:2,
            }  
           })
           gsap.to(".Developer-info-section", {   
            scrollTrigger: {
              trigger: '.developer-section',
              scroller: 'body',
              // markers:true,
              start: "1% 10%",
              end: '99% 35%',    
              scrub:2,
              pin:true
            }
           })
           gsap.to("#Developer2", {
          transform: "translateX(-60%)", 
            zIndex:2,
         duration:2,
            scrollTrigger: {
              scroller: 'body',
              trigger: '.Developer-info-section',
              // markers:true,
              start: "1% 10%",
              end: '20% 35%',    
              scrub:3,
            }
           })
           gsap.to("#Developer3", {
          transform: "translateX(-120%)", 
            zIndex:3,
            duration:2,
            delay:1,
            scrollTrigger: {
              scroller: 'body',
              trigger: '.Developer-info-section',
              // markers:true,
              start: "15% 10%",
              end: '35% 35%',    
              scrub:3,
            }
           })
          
        })   
}

export default AboutRouteAnimation