import mongoose from 'mongoose';
import { ReviewModel } from '../models/Review.model';
import { UserModel } from '../models/User.model';
import { StoreModel } from '../models/Store.model';
import { connectDatabase } from '../config/database';
import { logger } from '../config/logger';

/**
 * Wasabi Sushi & Bento 매장 ID
 */
const WASABI_STORE_ID = '694e0aa3ad206f17de894672';

/**
 * 더미 리뷰 데이터
 */
const reviewTemplates = [
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Great place to work! The management is very supportive and the team is friendly. The wage is fair and they always pay on time. Highly recommend working here.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Overall good experience. The work environment is decent and colleagues are helpful. Minimum wage but tips make up for it.',
    position: 'Cashier',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Excellent workplace! Flexible hours, great training, and the food staff discount is amazing. Would definitely recommend to friends.',
    position: 'Kitchen Staff',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 3,
    wageType: 'minimum_wage' as const,
    content: 'The job is okay but can be very busy during lunch rush. Management could be more organized. Pay is minimum wage.',
    position: 'Server',
    isAnonymous: true,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Nice team to work with. The pace can be fast but you learn quickly. Standard minimum wage for the area.',
    position: 'Prep Cook',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Best part-time job I\'ve had! Managers are understanding about student schedules and the atmosphere is positive.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 2,
    wageType: 'below_minimum' as const,
    content: 'They sometimes cut hours without notice and the wage doesn\'t match the workload during peak times.',
    position: 'Kitchen Staff',
    isAnonymous: true,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Good first job experience. Learned a lot about food service and customer interaction. Pay is standard.',
    position: 'Cashier',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Really enjoy working here! Free meal during shifts and the team makes it fun even during busy times.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 3,
    wageType: 'minimum_wage' as const,
    content: 'It\'s a decent job but very repetitive. The customers are usually nice though.',
    position: 'Cashier',
    isAnonymous: true,
    reviewMode: 'quick' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Fantastic workplace culture! Management genuinely cares about employee wellbeing and the pay reflects the hard work.',
    position: 'Supervisor',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Good balance between work and study. Managers are flexible with shift swaps.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'quick' as const,
  },
  {
    rating: 3,
    wageType: 'minimum_wage' as const,
    content: 'Average workplace. Could improve on communication between staff and management.',
    position: 'Kitchen Staff',
    isAnonymous: true,
    reviewMode: 'quick' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Love this job! Great benefits including staff discount and occasional bonuses. Team is like a family.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Clean work environment and good training program. Pay is standard for the industry.',
    position: 'Prep Cook',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 2,
    wageType: 'below_minimum' as const,
    content: 'Management expects too much for minimum wage. Often understaffed during peak hours.',
    position: 'Cashier',
    isAnonymous: true,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Perfect student job! Flexible scheduling and above minimum wage. Highly recommend!',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Nice colleagues and good location. Tips can be good on weekends.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'quick' as const,
  },
  {
    rating: 3,
    wageType: 'minimum_wage' as const,
    content: 'The job is fine but nothing special. Standard fast food experience.',
    position: 'Cashier',
    isAnonymous: true,
    reviewMode: 'quick' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Excellent management team! They provide proper training and support. The wage is competitive and there are opportunities for progression.',
    position: 'Kitchen Manager',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Good place for part-time work. The team is supportive and the work isn\'t too stressful.',
    position: 'Server',
    isAnonymous: false,
    reviewMode: 'quick' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Best job in Oxford! Amazing team, fair pay, and great work-life balance. The free sushi is a huge perk!',
    position: 'Chef',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
  {
    rating: 3,
    wageType: 'minimum_wage' as const,
    content: 'It pays the bills. Can get chaotic during lunch rush but manageable.',
    position: 'Kitchen Staff',
    isAnonymous: true,
    reviewMode: 'quick' as const,
  },
  {
    rating: 4,
    wageType: 'minimum_wage' as const,
    content: 'Friendly atmosphere and good learning experience. Would work here again.',
    position: 'Cashier',
    isAnonymous: false,
    reviewMode: 'quick' as const,
  },
  {
    rating: 5,
    wageType: 'above_minimum' as const,
    content: 'Incredible workplace! Management is transparent, wages are fair, and there\'s real potential for career growth.',
    position: 'Assistant Manager',
    isAnonymous: false,
    reviewMode: 'detailed' as const,
  },
];

/**
 * Seed 스크립트 실행
 */
async function seed() {
  try {
    // 데이터베이스 연결
    await connectDatabase();

    logger.info('🌱 리뷰 Seed 스크립트 시작');

    // 매장 확인
    const storeObjectId = new mongoose.Types.ObjectId(WASABI_STORE_ID);
    const store = await StoreModel.findById(storeObjectId);
    if (!store) {
      logger.error('매장을 찾을 수 없습니다:', WASABI_STORE_ID);
      process.exit(1);
    }

    logger.info(`매장 확인: ${store.name}`);

    // 테스트 사용자들 조회
    const users = await UserModel.find({
      email: { $in: ['tester@test.com', 'admin@test.com'] }
    });

    if (users.length === 0) {
      logger.error('테스트 사용자를 찾을 수 없습니다. 먼저 npm run seed:users를 실행하세요.');
      process.exit(1);
    }

    logger.info(`사용자 확인: ${users.length}명`);

    // 기존 리뷰 삭제 (해당 매장의 리뷰만)
    const deleteResult = await ReviewModel.deleteMany({
      store: storeObjectId as any
    });
    logger.info(`🗑️  기존 리뷰 ${deleteResult.deletedCount}개 삭제`);

    // 리뷰 생성
    const reviews = reviewTemplates.map((template, index) => ({
      ...template,
      store: storeObjectId as any,
      user: users[index % users.length]._id, // 사용자 번갈아가며 할당
      // 랜덤한 likeCount와 dislikeCount 추가
      likeCount: Math.floor(Math.random() * 20),
      dislikeCount: Math.floor(Math.random() * 5),
      helpfulCount: Math.floor(Math.random() * 15),
      // 시간차를 두고 생성된 것처럼 (최근 30일 내)
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }));

    const insertedReviews = await ReviewModel.insertMany(reviews);
    logger.info(`✅ ${insertedReviews.length}개의 리뷰 생성 완료`);

    // 매장 통계 업데이트 (평점, 리뷰 수, 급여 통계)
    logger.info('매장 통계 업데이트 중...');

    // 평균 평점 계산
    const totalRating = insertedReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / insertedReviews.length;

    // 급여 타입 통계 계산
    const wageStats = {
      belowMinimum: 0,
      minimumWage: 0,
      aboveMinimum: 0,
      total: 0,
    };

    insertedReviews.forEach((review) => {
      if (review.wageType) {
        wageStats.total++;
        if (review.wageType === 'below_minimum') wageStats.belowMinimum++;
        else if (review.wageType === 'minimum_wage') wageStats.minimumWage++;
        else if (review.wageType === 'above_minimum') wageStats.aboveMinimum++;
      }
    });

    // 매장 통계 업데이트
    await StoreModel.findByIdAndUpdate(storeObjectId, {
      averageRating: Math.round(averageRating * 10) / 10, // 소수점 첫째자리까지
      reviewCount: insertedReviews.length,
      wageStats,
    });

    logger.info('✅ 매장 통계 업데이트 완료', {
      averageRating: Math.round(averageRating * 10) / 10,
      reviewCount: insertedReviews.length,
      wageStats,
    });

    // 결과 출력
    console.log('\n📊 생성된 리뷰 데이터:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`매장: ${store.name}`);
    console.log(`총 리뷰 수: ${insertedReviews.length}`);
    console.log('\n리뷰 분포:');

    const ratingCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    insertedReviews.forEach((review) => {
      ratingCount[review.rating as keyof typeof ratingCount]++;
    });

    console.log(`⭐⭐⭐⭐⭐ (5점): ${ratingCount[5]}개`);
    console.log(`⭐⭐⭐⭐ (4점): ${ratingCount[4]}개`);
    console.log(`⭐⭐⭐ (3점): ${ratingCount[3]}개`);
    console.log(`⭐⭐ (2점): ${ratingCount[2]}개`);
    console.log(`⭐ (1점): ${ratingCount[1]}개`);

    const avgRating = insertedReviews.reduce((sum, r) => sum + r.rating, 0) / insertedReviews.length;
    console.log(`\n평균 평점: ${avgRating.toFixed(1)}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    logger.info('🎉 리뷰 Seed 완료!');
    logger.info(`이제 http://localhost:5173/stores/${WASABI_STORE_ID} 에서 확인하세요!`);

    // DB 연결 종료
    await mongoose.connection.close();
    logger.info('DB 연결 종료');
    process.exit(0);
  } catch (error) {
    logger.error('Seed 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
seed();
