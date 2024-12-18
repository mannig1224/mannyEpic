import React, { useState } from 'react';
import styles from './SettingsSection.module.css'; // Import the CSS module for styling

// Function to convert hex color to RGB
const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

const SettingsSection: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#f68220'); // Default primary color (orange in hex)

  // Handle color change from the color picker
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);

    // Convert hex to RGB and update the --primary-color-rgb CSS variable
    const rgbColor = hexToRgb(newColor);
    document.documentElement.style.setProperty('--primary-color-rgb', rgbColor); // RGB value
    document.documentElement.style.setProperty('--primary-color', newColor); // Hex value for non-opacity use
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Color picker for selecting the primary color */}
      <div className={styles.colorPickerContainer}>
        <label htmlFor="colorPicker" className={styles.selectLabel}>
          School Primary Color:
        </label>
        <div className={styles.pickerWrapper}>
          <input
            type="color"
            id="colorPicker"
            value={primaryColor}
            onChange={handleColorChange}
            className={styles.colorPicker}
          />
          <div className={styles.colorPreview} style={{ backgroundColor: primaryColor }}>
            {/* This shows a preview of the selected color */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
