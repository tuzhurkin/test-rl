// ---> add transitions
document.addEventListener('DOMContentLoaded', () => {
    setTimeout( () => { 
        document.body.classList.remove('no-transitions');
    }, 500);
    
    gsap.registerPlugin(ScrollTrigger);
})


// ---> floating header
headerActive();

function headerActive() {
    const header = document.querySelector('.header');
    let prevPos, curPos = 0;
    if( !header ) return;

    window.addEventListener('scroll', () => {
        prevPos = curPos;
        curPos = scrollY;

        if ( scrollY > 0 ) {
            // if we scroll up
            if ( curPos <= prevPos ) {
                if ( scrollY > 0 ) {
                    // header.classList.remove('header-hide');
                    header.classList.add('header-float');//
                }
            }
            // if we scroll down
            else {
                // header.classList.add('header-hide');
                // header.classList.remove('header-float');//
                header.classList.add('header-float');//
            }
        }
        // when we scroll to the very top
        else {
            // header.classList.remove('header-hide');
            header.classList.remove('header-float');//
        }
    })
}

// ---> scrolltrigger reveal

revealActive();

function revealActive() {
    if( !document.querySelectorAll('[data-reveal]').length || !document.querySelectorAll('[data-batch]').length ) return;

    gsap.defaults({ease: 'power3.easeOut'});
    gsap.set('[data-batch]', {y: 100});
    gsap.set('[data-reveal="up"]', {y: 100});
    gsap.set('[data-reveal="down"]', {y: -100});
    gsap.set('[data-reveal="scale"]', {opacity: 0, scale: 1.2});

    ScrollTrigger.batch('[data-batch]', {
        // interval: 0.2,
        onEnter: batch => gsap.to(batch, {
            opacity: 1, 
            y: 0,
            stagger: {
                each: 0.2
            }, 
            duration: 1,
            overwrite: true
        })
    });
    ScrollTrigger.batch('[data-reveal]', {
        interval: 0.5,
        onEnter: batch => gsap.to(batch, {
            opacity: 1, 
            y: 0, 
            scale: 1,
            stagger: {
                each: 0.4
            }, 
            duration: 1,
            overwrite: true
        })
    });
}


// ---> switcher
const switchers = document.querySelectorAll('.switcher');

if( switchers.length ) {
    switchers.forEach( switcher => {
        switcherActive(switcher);
    })
}

function switcherActive(switcher) {
    if( !switcher ) return;

    const indicator = switcher.querySelector('.switcher__indicator');
    const options = switcher.querySelectorAll('.switcher__option');
    const optionWidths = [];
    let activeIndex = 0;

    // > pass option els one by one to observe their widths using ResizeObserver API
    options.forEach( (el, index) => {
        observeOptionWidth(el, index);
    })

    // > set start option and update it on 'click'
    setOption(options[activeIndex], activeIndex);
    
    options.forEach( (option, i) => {
        option.addEventListener('click', () => {
            setOption(option, i);
        })
    })

    // > update option els' widths on 'resize', and therefore update indicator's width and left values
    function observeOptionWidth(el, i) {
        const resizeObserver = new ResizeObserver( entries => {
            for (let entry of entries) {
                optionWidths[i] = entry.target.getBoundingClientRect().width;
                setIndicator(optionWidths[activeIndex], activeIndex);
            }
        });

        resizeObserver.observe(el);
    }

    // > set active option, and therefore update indicator
    function setOption(option, i) {
        if( !option ) return;
        options.forEach( option => {
            if( option.classList.contains('active') ) {
                option.classList.remove('active');
            }
        })
        activeIndex = i;
        option.classList.add('active');

        setIndicator(option.getBoundingClientRect().width, i);
    }

    // > set indicator's width and left values
    function setIndicator(width, i) {
        indicator.style.width = `${width}px`;
        indicator.style.left = `calc(${optionWidths.slice(0, i).reduce((sum, n) => sum + n, 0)}px)`;
    }
}


// ---> magnetic buttons
if( window.matchMedia('(hover: hover) and (pointer: fine)').matches ) {
    magneticButtonActive();
}
window.addEventListener('resize', () => {
    if( window.matchMedia('(hover: hover) and (pointer: fine)').matches ) {
        magneticButtonActive();
    }
})

function magneticButtonActive() {
    const btns = document.querySelectorAll('.magnetic-button');
    if( !btns.length ) return;

    btns.forEach( btn => {
        btn.addEventListener('mousemove', (e) => {
            let position = btn.getBoundingClientRect();
            let x = e.clientX - position.left - position.width / 2;
            let y = e.clientY - position.top - position.height / 2;

            btn.querySelector('.magnetic-button__wrapper').style.transition = `transform 0s linear`; 
            btn.querySelector('.magnetic-button__wrapper').style.transform = `translate(${x * 0.2}px, ${y * 0.4}px)`; 
        })
    })
    btns.forEach( btn => {
        btn.addEventListener('mouseout', (e) => {
            btn.querySelector('.magnetic-button__wrapper').style.transition = `transform 0.15s linear`; 
            btn.querySelector('.magnetic-button__wrapper').style.transform = `translate(0px, 0px)`; 
        })
    })
}


// ---> fix button to the bottom on 'scroll'
fixedButtonActive();

function fixedButtonActive() {
    const btn = document.querySelector('[data-fixed-btn]');

    window.addEventListener('scroll', () => {
        if ( scrollY > 100 ) {
            btn.classList.add('float');
        }
        else {
            btn.classList.remove('float');
        }
    })
}