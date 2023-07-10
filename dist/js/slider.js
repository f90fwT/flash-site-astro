// This is the JS file for the 1 App, 3 Modes Slider

const tabs = document.querySelectorAll('.slider-tab');
const slides = document.querySelectorAll('.slide');
let currSlide = null;
let prevSlide = null;
let slideDelay = getComputedStyle(document.querySelector('.slide')).getPropertyValue('--_slide-transition');
slideDelay = parseFloat(slideDelay);

const appText = 'Made with convenience and ease of use in mind, Flash gives you the power of a bank in the palm of your hand';
const payText = 'Increase your revenue stream and global reach with Flash Business. Contact us to set up a Flash Business account';
const cashText = 'Turn your mobile device, or any internet browser into a cash register. Sell anything, anywhere, anytime with Flash Pay';
const defaultText = 'Select one of the boxes to learn more about the many features of Flash';
const textArray = [appText, cashText, payText, defaultText];
const colorArray = ['rgba(255, 242, 0, 0.25)', 'rgba(65, 173, 73, 0.25)', 'rgba(241, 164, 60, 0.25)', 'rgba(255, 255, 255, 0.25)'];
const defaultColor = 'rgba(255, 255, 255, 0.0)';


for (let i=0; i < tabs.length; i++) {
  tabs[i].addEventListener('click', tabSelect.bind(null, i), false);
}
for (let i=0; i < slides.length; i++) {
  slides[i].addEventListener('click', tabSelect.bind(null, i), false);
}

function collapseSlide(num) {
  let animName;
  switch (num) {
    case 0:
      animName = 'top-up';
      break;
    case 1:
      animName = 'mid-in'
      break;
    case 2:
      animName = 'btm-down'
      break;
  
    default:
      break;
  }
  slides[num].style.animationName = animName;
  setTimeout(() => {
    slides[num].style.zIndex = '0';
  }, slideDelay);
}
function expandSlide(num) {
  let animName;
  switch (num) {
    case 0:
      animName = 'top-down'
      break;
    case 1:
      animName = 'mid-out'
      break;
    case 2:
      animName = 'btm-up'
      break;
  
    default:
      break;
  }
  slides[num].style.animationName = animName;
  changeMsgText(num);
}
function changeMsgText(num) {
  $('.slider-msg p').text(textArray[num]);

  setTimeout(() => {
    changeSliderMsgBgColor(num);
  }, 200); // 200 milliseconds delay
}

function tabSelect(num) {
  if (num == currSlide) {
    removeActiveTab(num);
    currSlide = prevSlide = null;
    changeMsgText(textArray.length-1);
  } else {
    prevSlide = currSlide;
    currSlide = num;
    setActiveTab(num);
    // changeSliderMsgBgColor(num);

    // Scroll to the clicked tab.
    var container = document.querySelector('.slider-tabs');
    var scrollLeft = tabs[num].offsetLeft - container.offsetLeft;
    scrollLeft -= (container.offsetWidth - tabs[num].offsetWidth) / 2;
    container.scrollLeft = scrollLeft;
  }
}


function checkActiveTab() {
  let check = false;
  slides.forEach(slide => {
    if (slide.classList.contains('active')) {
      check = true;
    };
  });
  return check;
}
function setActiveTab(num) {
  const isTabActive = checkActiveTab();
  if (isTabActive) {
    removeActiveTab(prevSlide);
    setTimeout(() => {
      slides[num].style.zIndex = '1';
      slides[num].classList.add('active');
      tabs[num].classList.add('active');
      expandSlide(num);
      changeSliderMsgBgColor(num);
    }, slideDelay);
  } else {
    slides[num].style.zIndex = '1';
    slides[num].classList.add('active');
    tabs[num].classList.add('active');
    expandSlide(num);
    changeSliderMsgBgColor(num);
  }
}
function changeSliderMsgBgColor(num) {
  requestAnimationFrame(function() {
    const sliderMsg = document.querySelector('.slider-msg');
    sliderMsg.style.background = `
      linear-gradient(to top, transparent, ${colorArray[num]} 15%, ${colorArray[num]} 15%, transparent), 
      linear-gradient(to right, transparent, ${colorArray[num]} 15%, ${colorArray[num]} 15%, transparent), 
      linear-gradient(to left, transparent, ${colorArray[num]} 15%, ${colorArray[num]} 15%, transparent), 
      linear-gradient(to bottom, transparent, ${colorArray[num]} 15%, ${colorArray[num]} 15%, transparent)
      `;
  });
}
function resetSliderMsgBgColor() {
  requestAnimationFrame(function() {
    const sliderMsg = document.querySelector('.slider-msg');
    sliderMsg.style.background = `linear-gradient(to right, ${defaultColor}, transparent, transparent, ${defaultColor})`;
  });
}
function removeActiveTab(num) {
  collapseSlide(num);
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  tabs.forEach(tab => {
    tab.classList.remove('active');
  });
  resetSliderMsgBgColor();
}
$(document).ready(function() {
  $(".slide").hover(
      function() {
          // I'm assuming each 'slide' has a corresponding 'slider-tab' with the same index
          // This will only add 'hover-effect' to the 'slider-tab' corresponding to the 'slide' being hovered over
          let index = Array.from(document.querySelectorAll('.slide')).indexOf(this);
          $(".slider-tab").eq(index).addClass("hover-effect");
      },
      function() {
          let index = Array.from(document.querySelectorAll('.slide')).indexOf(this);
          $(".slider-tab").eq(index).removeClass("hover-effect");
      }
  );
});
// do the same thing as the above function in reverse
$(document).ready(function() {
  $(".slider-tab").hover(
    function() {
      let index = Array.from(document.querySelectorAll('.slider-tab')).indexOf(this);
      
      // Check if any .slide element has the 'active' class
      let anySlideActive = Array.from(document.querySelectorAll('.slide')).some(el => el.classList.contains('active'));
      
      // If no .slide element has the 'active' class, add 'push-effect'
      if (!anySlideActive && !$(".slide").eq(index).hasClass("active")) {
        $(".slide").eq(index).addClass("push-effect");
      }
    },
    function() {
      let index = Array.from(document.querySelectorAll('.slider-tab')).indexOf(this);
      $(".slide").eq(index).removeClass("push-effect");
    }
  );
});

