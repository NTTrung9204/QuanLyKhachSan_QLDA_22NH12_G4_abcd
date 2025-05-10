/**
 * Generate greeting message
 * @param {Object} user - User object (optional)
 * @returns {String} Greeting message
 */
exports.generateGreeting = (user) => {
  if (user) {
    return `Hello ${user.firstName}`;
  }
  return 'Hello World';
}; 