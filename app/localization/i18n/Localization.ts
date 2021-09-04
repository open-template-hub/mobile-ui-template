import I18n from 'i18n-js';
import {NativeModules, Platform} from 'react-native';
import en from './locales/en';
import tr from './locales/tr';

I18n.fallbacks = true;

I18n.translations = {
  en,
  tr,
};

I18n.defaultLocale = 'en';

try {
  var locale =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier; // "fr_FR"
  if (locale === undefined) {
    // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    if (locale == undefined) {
      locale = 'en'; // default language
    }
  } else {
    locale = locale.substring(0, 2);
  }
  I18n.locale = locale;
} catch (e) {
  console.log('Error on loading locale');
}

const Localization = I18n;

export default Localization;
