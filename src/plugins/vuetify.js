import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';


Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: colors.red.darken3,
            secondary: colors.green.darken3,
          },
          dark: {
            primary: colors.red.darken3,
            secondary: colors.green.darken3,
          },
        },
    },
});
