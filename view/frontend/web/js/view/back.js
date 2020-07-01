define(
  [
      'ko',
      'uiComponent',
      'underscore',
      'Magento_Checkout/js/model/step-navigator'
  ],
  function (
      ko,
      Component,
      _,
      stepNavigator
  ) {
      "use strict";

      return Component.extend({
          defaults: {
              template: 'Moonlay_CustomHome/back'
          },
          navigateToPrevStep: function () {
            stepNavigator.navigateTo('shipping');
          }
      });
  }
);