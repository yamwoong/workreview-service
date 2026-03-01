import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { Search, Star, FileText, Users, TrendingUp, ArrowRight } from 'lucide-react';

export const HomePage = (): JSX.Element => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isAuthenticated && user) {
    return <Navigate to="/stores" replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-[40px] sm:text-[52px] leading-tight text-gray-900 mb-6">
              {t('home.heroTitle1')}{' '}
              <span className="text-primary">{t('home.heroTitle2')}</span>
            </h1>
            <p className="text-[18px] text-gray-600 mb-10 leading-relaxed font-normal">
              {t('home.heroSubtitle1')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/stores"
                className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-xl hover:bg-[#b897c7] active:bg-[#a788b7] transition-all duration-200 shadow-md hover:shadow-lg font-medium text-[16px]"
              >
                {t('home.exploreStores')}
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium text-[16px]"
              >
                {t('home.signUp')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[32px] text-gray-900 mb-3">{t('home.howItWorksTitle')}</h2>
            <p className="text-[16px] text-gray-600 font-normal">
              {t('home.howItWorksSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="text-primary" size={26} />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{t('home.feature1Title')}</h3>
              <p className="text-[15px] text-gray-600 font-normal leading-relaxed">{t('home.feature1')}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="text-primary" size={26} />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{t('home.feature2Title')}</h3>
              <p className="text-[15px] text-gray-600 font-normal leading-relaxed">{t('home.feature2')}</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={26} />
              </div>
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">{t('home.feature3Title')}</h3>
              <p className="text-[15px] text-gray-600 font-normal leading-relaxed">{t('home.feature3')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats + Trust Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#f5f1f7] via-[#faf8fb] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-[32px] text-gray-900 mb-3">{t('home.communityTitle')}</h2>
            <p className="text-[16px] text-gray-600 max-w-2xl mx-auto font-normal">
              {t('home.communitySubtitle')}
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary" size={28} />
              </div>
              <div className="text-[36px] font-semibold text-gray-900 mb-1">2,500+</div>
              <div className="text-[15px] text-gray-600 font-normal">{t('home.statsReviews')}</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <div className="text-[36px] font-semibold text-gray-900 mb-1">1,200+</div>
              <div className="text-[15px] text-gray-600 font-normal">{t('home.statsUsers')}</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-primary" size={28} />
              </div>
              <div className="text-[36px] font-semibold text-gray-900 mb-1">850+</div>
              <div className="text-[15px] text-gray-600 font-normal">{t('home.statsWorkplaces')}</div>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-10 max-w-3xl mx-auto text-center">
            <h3 className="text-[24px] font-semibold text-gray-900 mb-4">{t('home.cardTitle')}</h3>
            <p className="text-[16px] text-gray-600 leading-relaxed mb-6 font-normal">
              {t('home.cardDescription1')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-[#b897c7] transition-all duration-200 font-medium text-[15px] shadow-sm"
              >
                {t('home.signIn')}
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/stores"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-medium text-[15px]"
              >
                {t('home.exploreStores')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
