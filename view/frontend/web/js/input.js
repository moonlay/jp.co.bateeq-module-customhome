define([
  'Magento_Ui/js/form/element/abstract',
  'mage/translate'
], function (AbstractField, $t) {
  'use strict';

  return AbstractField.extend({
    defaults: {
      modules: {
        region: '${ $.parentName }.region_id',
        city: '${ $.parentName }.city',
        // street: '${ $.parentName }.street',
      }
    },

    populateData: function () {
      // Create postcode patterns
      const postcodePattern1 = new RegExp("^[0-9]{7}$");
      const postcodePattern2 = new RegExp("^[0-9]{3}\-[0-9]{4}$");

      if (postcodePattern1.test(this.value())) {
        const nameFile = this.value().substr(0, 3);
        fetch(`https://moonlay.github.io/yubinbango-data/data/${nameFile}.js`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return Promise.reject(response);
          })
          .then(data => {
            // Set region and city values
            const regionValue = data[0].hasOwnProperty(this.value()) && data[0][this.value()][0];
            const cityValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][1] : '';
            // const streetValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][2] : '';
            this.region().value(parseInt(regionValue));
            this.city().value(cityValue);
            // this.street().elems()[0].set('value', streetValue);
          })
          .catch(error => console.warn(error))
      } else if (postcodePattern2.test(this.value())) {
        const nameFile = this.value().substr(0, 3);
        fetch(`https://moonlay.github.io/yubinbango-data/data/${nameFile}.js`)
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            return Promise.reject(response);
          })
          .then(data => {
            const postcodeModified = nameFile.concat(this.value().substr(4, 4))

            // Set region and city values
            const regionValue = data[0].hasOwnProperty(postcodeModified) && data[0][postcodeModified][0];
            const cityValue = data[0].hasOwnProperty(postcodeModified) ? data[0][postcodeModified][1] : '';
            // const streetValue = data[0].hasOwnProperty(this.value()) ? data[0][this.value()][2] : '';
            this.region().value(parseInt(regionValue));
            this.city().value(cityValue);
            // this.street().elems()[0].set('value', streetValue);
          })
          .catch(error => console.warn(error))
      } else {
        // Clean fields
        if (this.value() !== '') {
          this.region().value('');
        }
        this.city().value('');
        // this.street().elems()[0].set('value', '');
      }
    },

    setDifferedFromDefault: function () {
      this._super();
      this.populateData();
    }
  });
});
