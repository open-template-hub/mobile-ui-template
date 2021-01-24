import I18n from 'i18n-js';
import en from './locales/en';
import tr from './locales/tr';
import {NativeModules} from 'react-native';

I18n.fallbacks = true;

I18n.translations = {
  en,
  tr_TR: tr,
};

I18n.defaultLocale = 'en';

I18n.locale = NativeModules.I18nManager.localeIdentifier;

export default I18n;
