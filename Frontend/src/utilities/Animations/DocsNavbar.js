
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);


const DocsNavbarAnimation = ()=> {
    useGSAP(() => {
        gsap.to(".docs-main .docs-navbar", {
            boxShadow: '0px 2px 2px 2px rgba(0, 0, 0 ,0.4)',
           scrollTrigger: {
                scroller: "body",
                // markers: true,
                start: "5% top",
                end: "10% bottom",
                scrub: 2,
              }
     } )
})
}

export default DocsNavbarAnimation;