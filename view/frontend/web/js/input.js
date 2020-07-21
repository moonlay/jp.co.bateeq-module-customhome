define([
  'Magento_Ui/js/form/element/abstract',
  'mage/translate'
], function (AbstractField, $t) {
  'use strict';

  return AbstractField.extend({
      defaults: {
          modules: {
            city: '${ $.parentName }.city',
            street: '${ $.parentName }.street',
            // region: '${ $.parentName }.region_id',
            // region: document.querySelector('[name=region]')
          }
      },

      populateData: function () {
          if (this.value()?.length >= 7) {
            const nameFile = this.value().substr(0, 3);
            fetch(`https://moonlay.github.io/yubinbango-data/data/${nameFile}.js`)
              .then(response => {
                if (response.ok) {
                  return response.json();
                }
                return Promise.reject(response);
              })
              .then(data => {
                const cityValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][1] : '';
                const streetValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][2] : '';
                // const regionValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][1] : '';
                this.city().value(cityValue);
                this.street().elems()[0].set('value', streetValue);
                // this.region().value(regionValue);
                // const rg = document.querySelector('[name=region]');
                // rg.value = regionValue;
              })
              .catch(error => console.warn(error))
          } else {
            this.city().value('');
            this.street().elems()[0].set('value', '');
            // this.region().value('');
          }
      },

      setDifferedFromDefault: function () {
          this._super();
          this.populateData();
      }
  });
});
