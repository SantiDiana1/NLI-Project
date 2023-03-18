import React, { useState } from 'react';

const LanguageSwitcher = ({ languages, onChange }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedLanguage(selectedValue);
        onChange(selectedValue);
    };

    return (
        <select value={selectedLanguage} onChange={handleChange}>
            {languages.map((language) => (
                <option key={language} value={language}>
                    {language}
                </option>
            ))}
        </select>
    );
};

export default LanguageSwitcher;