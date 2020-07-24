<?php

namespace Moonlay\CustomHome\Block\Checkout;

class LayoutProcessor
{
    /**
     * Checkout LayoutProcessor after process plugin.
     *
     * @param \Magento\Checkout\Block\Checkout\LayoutProcessor $processor
     * @param array $jsLayout
     * @return array
     */
    public function afterProcess(\Magento\Checkout\Block\Checkout\LayoutProcessor $processor, $jsLayout)
    {
        $shippingConfiguration = &$jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shipping-address-fieldset']['children'];
        $billingConfiguration = &$jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
        ['children']['payment']['children']['payments-list']['children'];

        //Checks if shipping step available.
        if (isset($shippingConfiguration)) {
            $shippingConfiguration = $this->processAddress(
                $shippingConfiguration,
                'shippingAddress',
                [
                    'checkoutProvider',
                    'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.region_id',
                    'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.city',
                    'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.street',
                    'checkout.steps.shipping-step.shippingAddress.shipping-address-fieldset.country_id'
                ]
            );
        }

        //Checks if billing step available.
        if (isset($billingConfiguration)) {
            //Iterate over billing forms.
            foreach($billingConfiguration as $key => &$billingForm) {
                //Exclude not billing forms
                if (!strpos($key, '-form')) {
                    continue;
                }

                $billingForm['children']['form-fields']['children'] = $this->processAddress(
                    $billingForm['children']['form-fields']['children'],
                    $billingForm['dataScopePrefix'],
                    [
                        'checkoutProvider',
                        'checkout.steps.billing-step.payment.payments-list.' . $key . '.form-fields.region_id',
                        'checkout.steps.billing-step.payment.payments-list.' . $key . '.form-fields.city',
                        'checkout.steps.billing-step.payment.payments-list.' . $key . '.form-fields.street',
                        'checkout.steps.billing-step.payment.payments-list.' . $key . '.form-fields.country_id'
                    ]
                );
            }
        }

        return $jsLayout;
    }

    /**
     * Process provided address to contains checkbox and have trackable address fields.
     *
     * @param $addressFieldset - Address fieldset config.
     * @param $dataScope - data scope
     * @param $deps - list of dependencies
     * @return array
     */
    private function processAddress($addressFieldset, $dataScope, $deps)
    {
        //Creates input field.
        $addressFieldset['postcode'] = [
            'component' => 'Moonlay_CustomHome/js/input',
            'config' => [
                'customScope' => $dataScope,
                'template' => 'ui/form/field',
                'elementTmpl' => 'ui/form/element/input',
            ],
            'dataScope' => $dataScope . '.postcode',
            'deps' => $deps,
            'label' => __('郵便番号'),
            'provider' => 'checkoutProvider',
            'visible' => true,
            'sortOrder' => 110,
            'validation' => [
               'required-entry' => true
            ],
        ];

        //Makes each address field label trackable.
        if (isset($addressFieldset['street']['children'])) {
            foreach($addressFieldset['street']['children'] as $key => $street) {
                $street['tracks']['label'] = true;
                //Remove .additional class. Can be removed, but style fix provided instead.
                $street['additionalClasses'] = '';
                $addressFieldset['street']['children'][$key] = $street;
            }
        }

        return $addressFieldset;
    }
}
