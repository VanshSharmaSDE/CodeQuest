import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const ContactAnimation = () => {
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        scroller: "body",
        trigger: ".Contact_codeQuest-main-container",
        // markers: true,
        start: "5% top",
        end: "30% 5%" ,
        scrub: 2,      
      }
    });
    gsap.to(".contact_container .Contact_codeQuest-main-text .Contact_codeQuest-main-name", {
      opacity:0,
      ease: "power4.out",
     scrollTrigger: {
          scroller: "body",
          // markers: true,
          start: "1% top",
          end: "15% bottom",
          scrub: 2 
        }
},  )
    tl.add("same-time-width-decrese-and-sticky")
    tl.to(".contact_container .Contact_codeQuest-main-text>h1", {
      duration:2,
      x:-150,
      y:-30,
      fontSize: "5rem",
      ease: "sine.inOut",
   }, )
    tl.to(".contact_container .Contact_codeQuest-main-text .lineBar", {
      duration:2,
         x:-590,
         y:10,
         width:"150px", 
      ease: "sine.inOut"
}, "same-time-width-decrese-and-sticky")
    .to(".Contact_codeQuest-main-container p", { 
      opacity :1,
      y:-50,
    ease: "sine.inOut",
     scrollTrigger: {
          scroller: "body",
          // markers: true,
          start: "10% top",
          end: "30% bottom",
          scrub: 2,
          
        
        }
} )
     

  });
};
export default ContactAnimation;
