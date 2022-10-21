import includesFromArray from "./includesFromArray";

export default {
  mixins: [includesFromArray],
  methods: {
    isPortfolioNameValid(pName) {
      if (pName != null) {
        const forbiddenChars = [
          "/",
          "\\",
          "<",
          ">",
          ":",
          '"',
          "|",
          "?",
          "*",
          "&",
          "$",
          "#",
          "%",
          "@",
          "^",
          "+",
          "=",
          "~",
          "`",
          "{",
          "}",
          ";",
          ".",
          ",",
        ];
        // is valide wanneer er geen illegale karakters in zitten, de naam
        // niet leeg is en de naam ook niet langer is dan 30 karakters
        const valid =
          !this.includesFromArray(forbiddenChars, pName) &&
          pName.length > 0 &&
          pName.length < 30;

        return valid;
      } else {
        return false;
      }
    }
  }
}