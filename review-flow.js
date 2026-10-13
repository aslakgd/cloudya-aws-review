const questions = [
  {
    title: 'Roughly how much do you spend on AWS each month?',
    description: 'A range is enough. You do not need your bill to start.',
    options: [
      { id: 'under_1000', title: 'Under $1 000', short: 'Under $1 000 per month' },
      { id: '1000_to_10000', title: '$1 000 to under $10 000', short: '$1 000 to under $10 000 per month' },
      { id: '10000_to_50000', title: '$10 000 to under $50 000', short: '$10 000 to under $50 000 per month' },
      { id: '50000_plus', title: '$50 000 or more', short: '$50 000 or more per month' },
      { id: 'unknown', title: 'Not sure', short: 'Monthly spend to confirm' }
    ]
  },
  {
    title: 'Does your company use AWS Savings Plans?',
    description: 'This helps Cloudya understand which commitment questions to review.',
    options: [
      { id: 'yes', title: 'Yes, we have Savings Plans', short: 'Existing Savings Plans' },
      { id: 'no', title: 'No, we do not have Savings Plans', short: 'No Savings Plans' },
      { id: 'unknown', title: 'Not sure', short: 'Savings Plans to confirm' }
    ]
  }
];
const main = document.getElementById('main');
let step = -1;
const answers = [null, null];
const contact = { email: '', company: '' };
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const option = index => questions[index].options.find(item => item.id === answers[index]);

function focusView() {
  const heading = main.querySelector('h1,h2');
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function progress() {
  document.getElementById('steps').innerHTML = ['AWS spend', 'Savings Plans', 'Your details'].map((label, index) => `
    <li class="${step === index ? 'active' : step > index ? 'done' : ''}" ${step === index ? 'aria-current="step"' : ''}>
      <span class="stepnum">${step > index ? '✓' : index + 1}</span><span class="stepname">${label}</span>
    </li>`).join('');
}

function reviewFormat() {
  return `<div class="decision-map" aria-label="Example structure of the review">
    <div class="map-header"><span>What you receive</span><span>One page</span></div>
    <h3>Your AWS decision map</h3>
    <div class="map-row"><span class="map-number">01</span><div><strong>Commercial options</strong><p>What to compare in pricing, fees and terms.</p></div></div>
    <div class="map-row"><span class="map-number">02</span><div><strong>Commitment health</strong><p>What your usage and current plans need to support.</p></div></div>
    <div class="map-row"><span class="map-number">03</span><div><strong>Prioritised next steps</strong><p>What to act on, investigate or leave flexible.</p></div></div>
    <p class="map-caption">Example structure. Your review is prepared from the evidence agreed with Cloudya.</p>
  </div>`;
}

function render() {
  progress();
  if (step === -1) {
    main.innerHTML = `<section class="fade landing">
      <div class="eyebrow">AWS Economics Review</div>
      <h1>Get a second opinion on <span class="highlight">your AWS costs.</span></h1>
      <p class="lead">Ask Cloudya for a one-page assessment of your costs, commitments and what to investigate first.</p>
      <button class="primary" id="start">Start my AWS review <span class="arrow" aria-hidden="true">→</span></button>
      <p class="hint">Two short questions, then your contact details.<br>No meeting or document upload required to request a review.</p>
      ${reviewFormat()}
      <details class="evidence"><summary>What does the assessment use?</summary><p>A recent AWS bill, Cost Explorer summary or commitment overview can provide a starting point. Cloudya agrees the scope and the evidence needed with you before preparing the review.</p></details>
    </section>`;
    document.getElementById('start').onclick = () => { step = 0; render(); focusView(); };
    return;
  }
  if (step < questions.length) { renderQuestion(); return; }
  if (step === questions.length) { renderContact(); return; }
  renderPreview();
}

function renderQuestion() {
  const question = questions[step];
  main.innerHTML = `<section class="question fade">
    <div class="eyebrow">Question ${step + 1} of 2</div>
    <div class="progress" aria-hidden="true">${questions.map((_, index) => `<span class="${index <= step ? 'filled' : ''}"></span>`).join('')}</div>
    <h2 id="question-title">${question.title}</h2><p class="lead">${question.description}</p>
    <div class="choices" role="radiogroup" aria-labelledby="question-title">${question.options.map(item => `
      <button class="choice" role="radio" aria-checked="${answers[step] === item.id}" data-choice="${item.id}">
        <span class="radio" aria-hidden="true"></span><span><strong>${item.title}</strong></span>
      </button>`).join('')}</div>
    <div class="actions"><button class="quiet" id="back">${step === 0 ? 'Back to introduction' : 'Previous question'}</button><button class="primary" id="next" ${answers[step] ? '' : 'disabled'}>${step === 1 ? 'Continue to my details' : 'Continue'} <span class="arrow" aria-hidden="true">→</span></button></div>
  </section>`;
  main.querySelectorAll('[data-choice]').forEach(button => {
    button.onclick = () => select(button.dataset.choice);
    button.onkeydown = event => {
      const list = [...main.querySelectorAll('[data-choice]')], index = list.indexOf(button);
      let next;
      if (['ArrowDown', 'ArrowRight'].includes(event.key)) next = (index + 1) % list.length;
      if (['ArrowUp', 'ArrowLeft'].includes(event.key)) next = (index - 1 + list.length) % list.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = list.length - 1;
      if (next !== undefined) { event.preventDefault(); select(list[next].dataset.choice); list[next].focus(); }
    };
  });
  document.getElementById('back').onclick = () => { step--; render(); focusView(); };
  document.getElementById('next').onclick = () => { if (!answers[step]) return; step++; render(); focusView(); };
}

function select(id) {
  answers[step] = id;
  main.querySelectorAll('[data-choice]').forEach(button => button.setAttribute('aria-checked', String(button.dataset.choice === id)));
  document.getElementById('next').disabled = false;
}

function focusOfReview() {
  if (answers[1] === 'yes') return 'Your review will include questions about how your existing commitments fit your usage, alongside commercial options and next steps.';
  if (answers[1] === 'no') return 'Your review will include questions about the usage baseline to check before considering a commitment, alongside commercial options and next steps.';
  return 'Cloudya will help establish which commitments are in place and what evidence to review, alongside commercial options and next steps.';
}

function buildRequest() {
  const params = new URLSearchParams(location.search);
  return {
    email: contact.email.trim(),
    company: contact.company.trim(),
    aws_monthly_spend_range: answers[0],
    aws_savings_plans: answers[1],
    offer: 'aws_economics_review',
    offer_version: '2026-10-13',
    utm_source: (params.get('utm_source') || '').slice(0, 255),
    utm_medium: (params.get('utm_medium') || '').slice(0, 255),
    utm_campaign: (params.get('utm_campaign') || '').slice(0, 255),
    utm_content: (params.get('utm_content') || '').slice(0, 255)
  };
}

function renderContact() {
  main.innerHTML = `<section class="fade contact-view">
    <div class="eyebrow">Request your AWS Economics Review</div>
    <h2>Your AWS costs.<br><span class="highlight">A second opinion from Cloudya.</span></h2>
    <p class="lead">Cloudya will use your answers to agree the scope and evidence for a one-page review.</p>
    <div class="summary" aria-label="Your answers">${questions.map((_, index) => `<span>${escapeHTML(option(index).short)}</span>`).join('')}</div>
    <div class="review-focus"><p>${focusOfReview()}</p></div>
    <form id="review-form" class="contact-form">
      <div class="field"><label for="work-email">Work email <span>Required</span></label><input id="work-email" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" placeholder="you@company.com" value="${escapeHTML(contact.email)}" required></div>
      <div class="field"><label for="company">Company <span>Required</span></label><input id="company" name="company" autocomplete="organization" maxlength="200" placeholder="Company name" value="${escapeHTML(contact.company)}" required></div>
      <p class="privacy-note">Cloudya will use these details to contact you about your AWS Economics Review. <a href="https://www.cloudya.no/privacy" target="_blank" rel="noopener">Privacy policy</a></p>
      <div class="actions"><button type="button" class="quiet" id="back">Previous question</button><button class="primary" type="submit">Request my AWS review <span class="arrow" aria-hidden="true">→</span></button></div>
      <p class="hint">No phone number, meeting booking or document upload required here.</p>
    </form>
  </section>`;
  const email = document.getElementById('work-email'), company = document.getElementById('company');
  email.oninput = () => { contact.email = email.value; };
  company.oninput = () => { contact.company = company.value; company.setCustomValidity(''); };
  document.getElementById('back').onclick = () => { step = 1; render(); focusView(); };
  document.getElementById('review-form').onsubmit = event => {
    event.preventDefault();
    if (!company.value.trim()) { company.setCustomValidity('Please enter your company name.'); company.reportValidity(); return; }
    contact.email = email.value.trim(); contact.company = company.value.trim();
    step = 3; render(); focusView();
  };
}

function renderPreview() {
  main.innerHTML = `<section class="fade">
    <div class="eyebrow">Request received</div>
    <h2>Thank you.<br><span class="highlight">Your request is with Cloudya.</span></h2>
    <p class="lead">Cloudya will contact you to agree the scope and evidence for your AWS Economics Review.</p>
    <dl class="request-summary"><div><dt>Work email</dt><dd>${escapeHTML(contact.email)}</dd></div><div><dt>Company</dt><dd>${escapeHTML(contact.company)}</dd></div><div><dt>Monthly AWS spend</dt><dd>${escapeHTML(option(0).short)}</dd></div><div><dt>Savings Plans</dt><dd>${escapeHTML(option(1).short)}</dd></div></dl>
    <div class="next-step"><h3>What happens next?</h3><p>Cloudya will confirm what to review and which evidence is needed. A recent bill, Cost Explorer summary or commitment overview can be the starting point.</p><p>The review gives you a one-page decision map of commercial options, commitment questions and prioritised next steps.</p></div>
    <button class="quiet" id="overview">Back to overview</button>
  </section>`;
  document.getElementById('overview').onclick = () => { step = -1; render(); focusView(); };
}

render();
