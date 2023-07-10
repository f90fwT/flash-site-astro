/* 
* This JS file contains:
* 1. Navigation functions
* 2. Dark Mode Toggle functions
* 3. Accordion functions
* 4. Contact & Waitlist Form functions
* 5. Credits function
* 6. Startup functions
* 7. Event Listeners
*/

// Navigation
const openNavIcon = document.getElementById('open-nav');
const mainNav = document.getElementById('main-nav');
const closeNavIcon = document.getElementById('close-nav');
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
let currentNav = 0;
let prevNav = currentNav;

function changeMobileNavState() {
  if (mainNav.dataset.mobState === 'closed') {
    mainNav.dataset.mobState = 'open';
    mainNav.setAttribute('aria-hidden', false);
  } else {
    mainNav.dataset.mobState = 'closed';
    mainNav.setAttribute('aria-hidden', true);
  }
}

// Dark Mode Toggle
const modeContainer = document.getElementById('darkmode');
const modeSwitch = document.getElementById('dark-switch');
const footerHeight = document.querySelector('footer').offsetHeight;
const padding = window.getComputedStyle(document.documentElement).getPropertyValue('--padding-gen').replace('px', '');

function changeTheme(value) {
  if (value == 'light') {
    document.querySelector('body').classList.remove('dark-mode');
    document.querySelector('body').classList.add('light-mode');
    sessionStorage.setItem("theme", 'light');
    modeSwitch.checked = false;
  } else {
    document.querySelector('body').classList.remove('light-mode');
    document.querySelector('body').classList.add('dark-mode');
    sessionStorage.setItem("theme", 'dark');
    modeSwitch.checked = true;
  }
}
function checkThemePreference() {
  if(window.matchMedia("(prefers-color-scheme:dark)").matches) {
    changeTheme('dark');
  }
  if(window.matchMedia("(prefers-color-scheme:light)").matches) {
    changeTheme('light');
  }
}

// Accordion (FAQ Page)
const accordion = document.querySelector('.accordion');
function changeTab(activeTab) {
  const heads = activeTab.parentElement.querySelectorAll('.accordion-head');
  const tabs = document.querySelectorAll('.accordion-tab');
  const answers = activeTab.parentElement.querySelectorAll('.accordion-body');
  heads.forEach(head => {
    head.setAttribute('aria-expanded', false);
  });
  tabs.forEach(tab => {
    tab.dataset.active = 'inactive';
    tab.querySelector('.accordion-body').style.maxHeight = null;
  });
  answers.forEach(answer => {
    answer.setAttribute('aria-hidden', true);
  });
  activeTab.dataset.active = 'active';
  activeTab.querySelector('.accordion-head').setAttribute('aria-expanded', true);
  activeTab.querySelector('.accordion-body').setAttribute('aria-hidden', false);
  let tabHeight = activeTab.querySelector('.accordion-body').scrollHeight + "px";
  $(activeTab).find('.accordion-body').css('maxHeight', tabHeight);
}
function closeTab(activeTab) {
  activeTab.querySelector('.accordion-head').setAttribute('aria-expanded', false);
  activeTab.dataset.active = 'inactive';
  activeTab.querySelector('.accordion-body').style.maxHeight = null;
  activeTab.querySelector('.accordion-body').setAttribute('aria-hidden', true);
}

// Contact & Waitlist Forms
const sendMsgBtn = document.getElementById('send-msg-btn');
const signUpBtn = document.getElementById('sign-up-btn');
const errMsgBtn = document.getElementById('close-error-msg');
const errWtlBtn = document.getElementById('close-error-wtlist');
function checkEmpty(val) {
  if(val.length == 0 || val == " ") {
    return false;
  }
  return true;
}
function nameCheck(val) {
  let pattern = /^[a-z ,.'-]+$/i;
  if (pattern.test(val)) {
    return true;
  }
  return false;
}
function emailCheck(val) {
  let pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (pattern.test(val)) {
    return true;
  }
  return false;
}
function highlightError(input, pass) {
  if (!pass) {
    input.style.borderColor = 'var(--flash-red)';
    if (input.classList.contains('c-msg')) {
      input.placeholder = "You haven't typed a message!";
      input.classList.add('error');
    }
  } else {
    input.style.borderColor = 'var(--text-colour)';
    if (input.classList.contains('c-msg')) {
      input.placeholder = "";
      input.classList.remove('error');
    }
  }
}
function patternCheck(form) {
  let fieldset = [];
  let values = [];
  let pass = true;
  let noError = true;
  const cName = document.getElementById('c-name');
  const cEmail = document.getElementById('c-email');
  const cMsg = document.getElementById('c-msg');
  const wEmail = document.getElementById('w-email');
  if (form == 'msg') {
    fieldset = [
      {checker: nameCheck(cName.value), error: cName},
      {checker: emailCheck(cEmail.value), error: cEmail},
      {checker: checkEmpty(cMsg.value), error: cMsg}
    ];
    values = [
      {name: cName.value},
      {email: cEmail.value},
      {msg: cMsg.value}
    ];
  } else {
    fieldset = fieldset = [
      {checker: emailCheck(wEmail.value), error: wEmail}
    ];
    values = wEmail.value;
  }
  fieldset.forEach(field => {
    pass = field.checker;
    if (pass == false) {
      noError = false;
      highlightError(field.error, pass);
    } else {
      highlightError(field.error, pass);
    }
  });
  return [noError, values];
}
function sendMsg(values) {
  const name = values[0].name;
  const email = values[1].email;
  const msg = values[2].msg;
  let sendMsg = $.ajax({
    url: "./assets/services/sendMessage.php",
    type: "POST",
    data: {
      user: name,
      email: email,
      msg: msg
    },
    dataType: "json"
  });
  sendMsg.fail(function (jqXHR, textStatus) {
    console.error("Something went wrong! (sendMsg)" + textStatus);
    $('.error-msg').fadeIn('fast');
  });
  sendMsg.done(function (data) {
    if (data.error.id == 0) {
      $('.contact-form .formfields').css('display', 'none');
      $('.success-msg').css('display', 'block');
    }
  });
}
function addToWaitlist(values) {
  const email = values;
  let sendMsg = $.ajax({
    url: "./assets/services/addToWaitlist.php",
    type: "POST",
    data: {
      email: email
    },
    dataType: "json"
  });
  sendMsg.fail(function (jqXHR, textStatus) {
    console.error("Something went wrong! (sendMsg) " + textStatus);
    $('.error-waitlist').fadeIn('fast');
  });
  sendMsg.done(function (data) {
    if (data.error.id == 0) {
      $('.waitlist-form .formfields').css('display', 'none');
      $('.success-waitlist').css('display', 'block');
    }
  });
}

// Credits Functions
const creditsBtn = document.getElementById('credits-btn');
const creditsContent = document.getElementById('credits-content');
function toggleCredits() {
  creditsContent.classList.contains('open') ? creditsContent.classList.remove('open') : creditsContent.classList.add('open');
}


// ****** Start-up Functions ******
function loadScreen() {
  $('section').hide();
  progressBar = document.querySelector('.progress-bar');
  progressBar.style.setProperty('--_animation-name', 'page-load');
  setTimeout(() => {
    $('section').fadeIn();
    // Correct active nav if page is refreshed
    for (let i=0; i<navLinks.length; i++) {
      navLinks[i].classList.remove('active');
      if (i === 0) {
        navLinks[i].classList.add('active');
      }
    }
    $('#loading-screen').fadeOut('fast');
  }, 2000);
}
// Remember theme preference during session
if (sessionStorage.getItem('theme')) {
  changeTheme(sessionStorage.getItem('theme'));
} else {
  checkThemePreference();
}
// Hide nav list items from screen readers if nav is collapsed on small screens
if (window.innerWidth < 800) {
  mainNav.setAttribute('aria-hidden', true);
}

// 
function initializeAccordion() {
  const accordion = document.querySelector('.accordion');
  accordion.addEventListener('click', (e)=>{
    const activeTab = e.target.closest('.accordion-tab');
    const headClick = e.target.closest('.accordion-head');
    if (!activeTab) return;
    if (activeTab.dataset.active == 'inactive') {
      changeTab(activeTab);
    } else {
      // Only close the tab if they click on the tab head
      if (!headClick) return;
      closeTab(activeTab);
    }
  });
}

window.onload = () => {
  loadScreen();

  // ****** Event Listeners ******
  // Dark Mode Changing
  modeSwitch.addEventListener('change', ()=>{
    if(modeSwitch.checked) {
      changeTheme('dark');
    } else {
      changeTheme('light');
    }
  });

  // Scroll Events
  window.addEventListener("scroll", ()=>{
    // Stop Dark Mode switch from sticking to bottom of screen when footer appears
    let limit = document.body.scrollHeight - window.innerHeight - footerHeight - modeContainer.offsetHeight - (padding * 3);
    let scroll = window.scrollY;
    if (scroll > limit) {
      document.getElementById('spaceholder').style.height = '0';
      modeContainer.style.position = 'relative';
    } else {
      document.getElementById('spaceholder').style.height = '20px';
      modeContainer.style.position = 'fixed';
    }
    
    // Change Active Navigation Link
    for (let i=0; i<pages.length; i++) {
      if (window.scrollY >= pages[i].offsetTop - (pages[i].offsetHeight/2)) {
        prevNav = currentNav;
        currentNav = i;
      }
    }
    if (currentNav != prevNav) {
      for (let i=0; i<navLinks.length; i++) {
        navLinks[i].classList.remove('active');
        if (i === currentNav) {
          navLinks[i].classList.add('active');
        }
      }
    }
  });
  
  // Mobile Navigation Open and Closing
  openNavIcon.addEventListener('click', changeMobileNavState);
  closeNavIcon.addEventListener('click', changeMobileNavState);
  $('.nav-link').click(()=>{changeMobileNavState()});

  // Send Message
  sendMsgBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const checkResult = patternCheck('msg');
    if (checkResult[0]) {
      sendMsg(checkResult[1]);
    }
  });
  signUpBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    const checkResult = patternCheck('waitlist');
    if (checkResult[0]) {
      addToWaitlist(checkResult[1]);
    }
  });
  // Close Form Error
  errMsgBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    $('.error-msg').fadeOut('fast');
  });
  errWtlBtn.addEventListener('click', (e)=> {
    e.preventDefault();
    $('.error-waitlist').fadeOut('fast');
  });

  // Credits Open and Close
  creditsBtn.addEventListener('click', ()=>{
    toggleCredits();
  });
  
  // Lightning Functions
  observer.observe(cvsStorm);
  observer.observe(cvsMtn);
  observer.observe(cvsCnt);
  requestAnimationFrame(animate);
  startLightning(stormInterval);

  // Touch Triggered Lightning
  cvsTch.onpointerdown = (e) => {
    cvsTch.setPointerCapture(e.pointerId);
    // stop other animation
    clearInterval(lightningInterval);
    clearCanvas();
    touch = true;
    tchTarget = {x: e.clientX - cvsTch.getBoundingClientRect().left, y: e.clientY - cvsTch.getBoundingClientRect().top};

    cvsTch.onpointermove = (e) => {
        let x = e.clientX - cvsTch.getBoundingClientRect().left;
        let y = e.clientY - cvsTch.getBoundingClientRect().top;
        if (x>0 && e.clientX<cvsTch.getBoundingClientRect().right && y>0 && e.clientY<cvsTch.getBoundingClientRect().bottom) {
        tchTarget = {x: x, y: y};
      } else {
        cvsTch.onpointermove = null;
        cvsTch.onpointerup = null;
        touch = false;
        tchLightning.clear(ctxTch);
      }
      
    }
  
    cvsTch.onpointerup = (e) => {
      cvsTch.onpointermove = null;
      cvsTch.onpointerup = null;
      touch = false;
      tchLightning.clear(ctxTch);
    }
    cvsTch.onpointercancel = (e) => {
      cvsTch.onpointermove = null;
      cvsTch.onpointerup = null;
      touch = false;
      tchLightning.clear(ctxTch);
    }
    cvsTch.onpointerleave = (e) => {
      cvsTch.onpointermove = null;
      cvsTch.onpointerup = null;
      touch = false;
      tchLightning.clear(ctxTch);
    }
  }
  resizeTchCanvas();
  createTchLightning(lightningThickness, roughness, minSegmentHeight);
  window.requestAnimationFrame(tchAnimate);
  
  
  $(window).on('resize', function(){
    resizeCanvas();
  });
}
