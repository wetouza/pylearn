import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { FAQSection } from "@/components/sections/faq-section";
import { CTASection } from "@/components/sections/cta";
import { WebsiteJsonLd, CourseJsonLd } from "@/components/shared/json-ld";
import { ContinueLearningWrapper } from "@/components/shared/continue-learning-wrapper";

export default function HomePage() {
  return (
    <>
      <WebsiteJsonLd
        name="PyLearn"
        description="Современная образовательная платформа для изучения Python с нуля"
        url="https://pylearn.ru"
      />
      <CourseJsonLd
        name="Python для начинающих"
        description="Бесплатный курс Python с нуля. Пошаговые уроки, практика и поддержка."
        provider="PyLearn"
        url="https://pylearn.ru"
      />
      
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ContinueLearningWrapper />
        <FeaturesSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

