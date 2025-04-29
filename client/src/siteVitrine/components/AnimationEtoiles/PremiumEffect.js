import Anime from "animejs";
import {useEffect} from "react";

const ComposantPremiumEffect = () => {
    useEffect(() => {
    let container = document.querySelector(".anime-container");

    let sparks = [];
    let sparksIndex = 0;

    let sparkCount = 100;
    let sparkParticleCount = 6;

    function lerp(p1, p2, t) {
        return p1 + (p2 - p1) * t;
    }

    //https://gist.github.com/gre/1650294
    const ease = {
        // no easing, no acceleration
        linear: (t) => t,
        // accelerating from zero velocity
        inQuad: (t) => t * t,
        // decelerating to zero velocity
        outQuad: (t) => t * (2 - t),
        // acceleration until halfway, then deceleration
        inOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
        // accelerating from zero velocity
        inCubic: (t) => t * t * t,
        // decelerating to zero velocity
        outCubic: (t) => --t * t * t + 1,
        // acceleration until halfway, then deceleration
        inOutCubic: (t) =>
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        // accelerating from zero velocity
        inQuart: (t) => t * t * t * t,
        // decelerating to zero velocity
        outQuart: (t) => 1 - --t * t * t * t,
        // acceleration until halfway, then deceleration
        inOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),
        // accelerating from zero velocity
        inQuint: (t) => t * t * t * t * t,
        // decelerating to zero velocity
        outQuint: (t) => 1 + --t * t * t * t * t,
        // acceleration until halfway, then deceleration
        inOutQuint: (t) =>
            t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
    };

    // https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly
    function circularRandom(r) {
        // Math.abs(Math.random() - Math.random()) makes it have a bias towards 0, or in our case the center
        r = r * Math.sqrt(Math.abs(Math.random() - Math.random()));
        let theta = Math.random() * 2 * Math.PI;
        let x = r * Math.cos(theta);
        let y = r * Math.sin(theta);
        return {x: x, y: y, r: r};
    }

    // Create the sparks
    for (let i = 0; i <= sparkCount; i += 1) {
        let spark = {els: []};

        for (let j = 0; j < sparkParticleCount; j++) {
            let dot = document.createElement("div");
            dot.classList.add("dot");
            container.appendChild(dot);
            spark.els.push(dot);

            let particleSize = Anime.random(5, 20);
            let sparkRadius = 20;
            let {x, y, r} = circularRandom(sparkRadius);

            // Make particles further from the center, smaller
            dot.style.width =
                lerp(particleSize, 1, ease.outQuad(r / sparkRadius)) + "px";
            dot.style.height =
                lerp(particleSize, 1, ease.outQuad(r / sparkRadius)) + "px";
            dot.style.opacity = "0";
            // by setting the particles start offset position using translate we can reposition the spark using left and top
            dot.style.transform = "translateX(" + x + "px) translateY(" + y + "px)";
        }

        spark.anime = new Anime({
            targets: spark.els,
            loop: false,
            easing: "linear",
            autoplay: false,
            delay: Anime.stagger(8),
            opacity: [
                {value: 0, duration: 0},
                {value: 1, duration: 40},
                {
                    value: 0,
                    duration: function () {
                        return Anime.random(500, 800);
                    }
                }
            ],
            width: {value: 2, duration: 500},
            height: {value: 2, duration: 500},
            translateX: {
                value: function () {
                    return Anime.random(-30, 30);
                },
                duration: 800
            },
            translateY: {
                value: function () {
                    return Anime.random(-30, 30);
                },
                duration: 800
            }
        });
        sparks.push(spark);
    }

    // Mouse trail bit
        window.addEventListener("mousemove", function (e) {
            const container = document.querySelector('.anime-container');

            if (container && container.contains(e.target)) {
                if (sparksIndex < sparks.length) {
                    Anime.set(sparks[sparksIndex].els, {
                        left: e.pageX,
                        top: e.pageY
                    });
                    sparks[sparksIndex].anime.restart();
                    sparksIndex++;
                } else {
                    // Si nous avons atteint la fin de la liste des étincelles, réinitialisez l'index
                    sparksIndex = 0;
                }
            }
        });
    }, []);

    return null;
};

export default ComposantPremiumEffect;