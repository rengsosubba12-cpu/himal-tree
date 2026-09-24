import assert from 'node:assert';

// Test logic mirroring BookingForm's validation and WhatsApp URL generation

function validateForm(formData) {
  const newErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Please enter your name';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Please enter your email';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
  }

  if (!formData.date.trim()) {
    newErrors.date = 'Please select a reservation date';
  }

  if (!formData.time.trim()) {
    newErrors.time = 'Please select a reservation time';
  }

  if (!formData.partySize.trim()) {
    newErrors.partySize = 'Please select party size';
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors
  };
}

function generateWhatsAppUrl(formData, phoneNumber = '+919883597341') {
  const partyClean = formData.partySize.replace(/\s*guests?/i, '').trim() || formData.partySize.trim();
  const specialRequests = (formData.specialRequests || formData.requests || '').trim() || 'None';

  const message = [
    '🍜 *NEW TABLE RESERVATION - HIMAL TREE*',
    '',
    `*Name:* ${formData.name.trim()}`,
    `*Email:* ${formData.email.trim()}`,
    `*Date:* ${formData.date.trim()}`,
    `*Time:* ${formData.time.trim()}`,
    `*Party Size:* ${partyClean} Guests`,
    `*Special Requests:* ${specialRequests}`
  ].join('\n');

  let cleanPhone = (phoneNumber || '+919883597341').replace(/[^0-9]/g, '');
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }

  return {
    message,
    url: `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
  };
}

// TEST 1: Missing all required fields
{
  const emptyForm = { name: '', email: '', date: '', time: '', partySize: '', specialRequests: '' };
  const val = validateForm(emptyForm);
  assert.strictEqual(val.isValid, false);
  assert.strictEqual(Object.keys(val.errors).length, 5);
  console.log('✓ Test 1: Empty form validation passed');
}

// TEST 2: Invalid email
{
  const invalidEmailForm = { name: 'Alice', email: 'invalid-email', date: '2026-09-25', time: '7:00 PM', partySize: '2 Guests' };
  const val = validateForm(invalidEmailForm);
  assert.strictEqual(val.isValid, false);
  assert.strictEqual(val.errors.email, 'Please enter a valid email address');
  console.log('✓ Test 2: Invalid email detection passed');
}

// TEST 3: Valid form with special requests
{
  const validForm = {
    name: 'John Doe',
    email: 'john@example.com',
    date: '2026-09-25',
    time: '7:00 PM',
    partySize: '4 Guests',
    specialRequests: 'Window seat by the sakura garden'
  };
  const val = validateForm(validForm);
  assert.strictEqual(val.isValid, true);

  const { message, url } = generateWhatsAppUrl(validForm);
  assert.ok(url.startsWith('https://wa.me/919883597341?text='));
  assert.ok(message.includes('🍜 *NEW TABLE RESERVATION - HIMAL TREE*'));
  assert.ok(message.includes('*Name:* John Doe'));
  assert.ok(message.includes('*Email:* john@example.com'));
  assert.ok(message.includes('*Date:* 2026-09-25'));
  assert.ok(message.includes('*Time:* 7:00 PM'));
  assert.ok(message.includes('*Party Size:* 4 Guests'));
  assert.ok(message.includes('*Special Requests:* Window seat by the sakura garden'));
  console.log('✓ Test 3: Valid form with special requests generated exact URL');
}

// TEST 4: Valid form without special requests (should output "None")
{
  const noRequestsForm = {
    name: 'Jane Smith',
    email: 'jane@test.org',
    date: '2026-09-26',
    time: '1:00 PM',
    partySize: '2 Guests',
    specialRequests: ''
  };
  const val = validateForm(noRequestsForm);
  assert.strictEqual(val.isValid, true);

  const { message } = generateWhatsAppUrl(noRequestsForm);
  assert.ok(message.includes('*Special Requests:* None'));
  console.log('✓ Test 4: Default "None" for empty special requests passed');
}

// TEST 5: Custom phone number prop / 10-digit phone
{
  const form = {
    name: 'Bob',
    email: 'bob@gmail.com',
    date: '2026-09-27',
    time: '8:00 PM',
    partySize: '6 Guests'
  };
  const { url: url10 } = generateWhatsAppUrl(form, '9883597341');
  assert.ok(url10.startsWith('https://wa.me/919883597341?text='));

  const { url: urlCustom } = generateWhatsAppUrl(form, '+1 (555) 234-5678');
  assert.ok(urlCustom.startsWith('https://wa.me/15552345678?text='));
  console.log('✓ Test 5: Phone number sanitization and customization passed');
}

console.log('\nAll tests passed successfully!');
