export default {
  methods: {
    // returnt de totaal aantal aan trades (buys of sells)
    getTradeCount(data) {
      const searchIndex = this.searchIndex;
     
      let tot = 0;

      // loop door data heen, als de searchIndex niet leeg is
      // voeg toe aan totaal
      for (let i = 0; i < data.length; i++) {
        if (data[i][searchIndex] !== "") {
          tot += 1;
        }
      }

      // maak er een mooi nummer van
      tot = tot.toString();

      return tot;
    },
  }
}