const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

module.exports = class AccessorsAndMutators {
  // ? *************************** Encrypt the values ************************ */
  static hashMake(value) {
    const salt = bcrypt.genSaltSync(10);
    const hashedValue = bcrypt.hashSync(value, salt);
    return hashedValue;
  }

  // ? *************************** Compare the encrypt values ************************ */
  static compareHash(enteredPassword, dbPassword) {
    const isSame = bcrypt.compareSync(enteredPassword, dbPassword);
    if (!isSame) {
      return false;
    }
    return true;
  }

  // ? ************************* Uppercase first letter ********************** */
  static uppercaseFirst(value) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
  }

  // ? ************************ uppercase all the first letters *********************** */
  static uppercaseWords(value) {
    let splitValue = value.toLowerCase().split(" ");
    for (var i = 0; i < splitValue.length; i++) {
      splitValue[i] = `${splitValue[i].charAt(0).toUpperCase()}${splitValue[
        i
      ].substring(1)}`;
    }
    return splitValue.join(" ");
  }

  // ? ************************ Generate Random numbers *********************** */
  static randNumber(length) {
    return Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );
  }

  // ? ************************ Create created At date *********************** */
  static createdAt() {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
  }

  // ? ************************ Singular the word *********************** */
  static singularize(word) {
    const endings = {
      ves: "fe",
      ies: "y",
      i: "us",
      zes: "ze",
      ses: "s",
      es: "e",
      s: "",
    };
    return word.replace(
      new RegExp(`(${Object.keys(endings).join("|")})$`),
      (r) => endings[r]
    );
  }

  // ? ************************ Create updated At date *********************** */
  static updatedAt() {
    return new Date().toISOString().replace("T", " ").replace("Z", "");
  }

  // ? ******************************************************** Set the files data ******************************************************** */
  static setFilesData(files, filesPath) {
    return files === "" || files === null
      ? []
      : files.split(",").map((doc) => ({
          size: this.formatSizeUnits(`../public/${filesPath}/${doc}`),
          name: doc,
          file: doc,
          percentage: 100,
        }));
  }

  // ? ******************************************************** Size of the files ******************************************************** */
  static formatSizeUnits(filePath) {
    if (!fs.existsSync(path.join(__dirname, `${filePath}`))) {
      return null;
    }
    const stats = fs.statSync(path.join(__dirname, `${filePath}`));
    let bytes = stats.size;
    if (bytes >= 1073741824) {
      bytes = (bytes / 1073741824).toFixed(2) + " GB";
    } else if (bytes >= 1048576) {
      bytes = (bytes / 1048576).toFixed(2) + " MB";
    } else if (bytes >= 1024) {
      bytes = (bytes / 1024).toFixed(2) + " KB";
    } else if (bytes > 1) {
      bytes = bytes + " bytes";
    } else if (bytes === 1) {
      bytes = bytes + " byte";
    } else {
      bytes = "0 bytes";
    }
    return bytes;
  }

  // ? ******************************************************** Convert time to 12 hour format ******************************************************** */
  static convertTimeTo12HourFormat(time) {
    const [hours, minutes] = time.split(":");
    let formatType = "AM";
    let formattedHours = parseInt(hours, 10);
    if (formattedHours >= 12) {
      formatType = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }

    return `${formattedHours}:${minutes} ${formatType}`;
  }

  // ? ******************************************************** Convert time to hours Mins and seconds ******************************************************** */
  static convertTimeToHoursMinutesAndSeconds(timestamp) {
    const isFormattedTime = (timeString) => {
      return (
        /^(\d{2}):(\d{2}):(\d{2})$/.test(timeString) ||
        /^(\d{2}):(\d{2})$/.test(timeString)
      );
    };

    if (isFormattedTime(timestamp)) {
      return timestamp;
    }

    const totalSeconds = Math.floor(parseInt(timestamp));

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }
  }

  // ? ******************************************************** Convert date and time readable ******************************************************** */
  static convertDateAndTimeReadable(date) {
    if (date) {
      const optionsDate = {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      };
      const optionsTime = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      const formattedDate = date.toLocaleDateString("en-US", optionsDate);
      const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
      return `${formattedDate} ${formattedTime}`;
    }
    return date;
  }
};
