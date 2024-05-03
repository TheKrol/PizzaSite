const resetPasswordValidation = (values) => {
    const errors = {};

    if (!values.newPassword) {
        errors.newPassword = 'New password is required.';
    } else if (values.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters long.';
    }

    if (!values.confirmPassword) {
        errors.confirmPassword = 'Confirm password is required.';
    } else if (values.confirmPassword !== values.newPassword) {
        errors.confirmPassword = 'Passwords do not match.';
    }

    return errors;
};

export default resetPasswordValidation;
