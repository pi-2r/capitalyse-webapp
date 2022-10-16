<template>
  <section class="dropdown">
    <Icon
      @click="togglePopup"
      class="head_"
      icon="entypo:dots-three-vertical"
      height="20"
    />

    <!-- menu -->
    <transition mode="out-in" name="slide-fade">
      <section v-if="isPopupVisible" class="dropdown-content">
        <section class="dropDownItem">
          <section class="dropDownItem__checkBoxItem">
            <input
              type="checkbox"
              v-model="isPortfolioPublic"
              name="public"
              id="public"
            />
            <label for="public">Make public</label>
          </section>

          <transition mode="out-in" name="slide-fade">
            <section
              v-if="isPortfolioPublic"
              class="copyShareLink"
              @click="copyPublicURL"
              :style="[
                justClickedCopy
                  ? {
                      'border-color': 'var(--clr-green)',
                      'background-color': 'rgba(9, 232, 54, 0.05)',
                      color: 'var(--clr-green',
                    }
                  : null,
              ]"
            >
              <Icon icon="akar-icons:link-chain" />{{ copyPublicURLText }}
            </section>
          </transition>
          <!-- <p class="explanation">Make your portfolio public so you can show your friends.</p> -->
        </section>
      </section>
    </transition>
  </section>
</template>
<script>
import { Icon } from "@iconify/vue";

export default {
  data() {
    return {
      isPopupVisible: true,
      isPortfolioPublic: true,
      justClickedCopy: false,
    };
  },
  components: {
    Icon,
  },
  computed: {
    copyPublicURLText() {
      if (this.justClickedCopy) {
        return "Copied!";
      } else {
        return "Copy public URL";
      }
    },
  },
  methods: {
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
    async copyPublicURL() {
      try {
        const uid = localStorage.getItem("userId");
        await navigator.clipboard.writeText(
          `https://my.capitalyse.app/shared/${uid}/${this.$route.params.id}`
        );
        this.justClickedCopy = true;
        setTimeout(() => {
          this.justClickedCopy = false;
        }, 10000);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style scoped>
.explanation {
  font-size: 0.75rem;
  color: var(--clr-medium-light-grey-2);
  line-height: 12px;
}

.copyShareLink {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  padding: 0.25rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.85rem;
  border-radius: var(--btn-radius);
  transition: 0.2s all;
  border: 1px solid transparent;
}
.copyShareLink:hover {
  cursor: pointer;
  color: var(--clr-blue);
  border: 1px solid rgba(9, 124, 232, 0.5);
  background-color: rgba(9, 124, 232, 0.05);
}
.copyShareLinkClicked {
  border: 1px solid var(--clr-green);
  background-color: rgba(9, 232, 54, 0.05);
}

input {
  padding: 20rem;
  appearance: auto;
  cursor: pointer;
}

.dropdown {
  position: relative;
}
.dropdown-content {
  display: block;
  position: absolute;
  right: 0;
  top: 2.5rem;
  background-color: var(--clr-white);
  border: 1px solid var(--clr-medium-light-grey);
  border-radius: var(--card-border-radius);
  box-shadow: var(--box-shadow-small);
  min-width: 12rem;
  z-index: 99999;
  padding: 0.5rem;
}

.dropdown-content > .dropDownItem {
  color: var(--clr-black);
  padding: 0.5rem;
  text-decoration: none;
  border-radius: var(--btn-radius);
  display: block;
}

.dropDownItem__checkBoxItem {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5rem;
}

.dropdown .dropDownItem:hover {
  cursor: auto;
}

.show {
  display: block;
}

@media screen and (max-width: 700px) {
  .dropdown-content {
    left: 0rem;
  }
}
</style>