import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

export const Footer = (): JSX.Element => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900 mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/stores" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-normal">
                  {t('nav.findStores')}
                </Link>
              </li>
              <li>
                <Link to="/stores/search" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-normal">
                  {t('nav.search')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-gray-900 mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-normal">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-normal">
                  {t('footer.termsOfService')}
                </a>
              </li>
              <li>
                <a href="#" className="text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-normal">
                  {t('footer.contactUs')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="text-white" size={16} />
            </div>
            <span className="text-[16px] font-semibold text-gray-900">WorkReview</span>
          </Link>
          <p className="text-[14px] text-gray-500 font-normal">
            © {currentYear} WorkReview. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};
