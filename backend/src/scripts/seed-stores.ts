import mongoose from 'mongoose';
import { StoreModel } from '../models/Store.model';
import { UserModel } from '../models/User.model';
import { connectDatabase } from '../config/database';
import { logger } from '../config/logger';

/**
 * Store 시드 데이터
 */
const seedStores = [
  {
    name: 'Starbucks Oxford Street',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '91-92 High St, Oxford OX1 4BJ, UK',
      street: '91-92 High St',
      city: 'Oxford',
      postalCode: 'OX1 4BJ',
    },
    location: {
      type: 'Point',
      coordinates: [-1.2577, 51.752],
    },
    category: 'cafe',
    phone: '+44 1865 791479',
    currency: 'GBP',
    averageRating: {
      salary: 4.2,
      restTime: 3.8,
      workEnv: 4.0,
      management: 4.1,
      overall: 4.03,
    },
    averageWage: {
      min: 10.5,
      max: 13.25,
      average: 11.85,
      count: 8,
    },
    reviewCount: 12,
  },
  {
    name: 'Costa Coffee Piccadilly',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '125 Piccadilly, London W1J 7NB, UK',
      street: '125 Piccadilly',
      city: 'London',
      postalCode: 'W1J 7NB',
    },
    location: {
      type: 'Point',
      coordinates: [-0.1419, 51.5074],
    },
    category: 'cafe',
    phone: '+44 20 7493 8070',
    currency: 'GBP',
    averageRating: {
      salary: 4.0,
      restTime: 3.5,
      workEnv: 3.8,
      management: 3.9,
      overall: 3.8,
    },
    averageWage: {
      min: 10.42,
      max: 12.5,
      average: 11.2,
      count: 6,
    },
    reviewCount: 8,
  },
  {
    name: "McDonald's Manchester",
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '1 Piccadilly Gardens, Manchester M1 1RG, UK',
      street: '1 Piccadilly Gardens',
      city: 'Manchester',
      postalCode: 'M1 1RG',
    },
    location: {
      type: 'Point',
      coordinates: [-2.2374, 53.4808],
    },
    category: 'restaurant',
    phone: '+44 161 228 2134',
    currency: 'GBP',
    averageRating: {
      salary: 3.5,
      restTime: 3.0,
      workEnv: 3.2,
      management: 3.3,
      overall: 3.25,
    },
    averageWage: {
      min: 10.42,
      max: 11.5,
      average: 10.8,
      count: 15,
    },
    reviewCount: 25,
  },
  {
    name: 'Tesco Express Birmingham',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '45 High St, Birmingham B4 7SL, UK',
      street: '45 High St',
      city: 'Birmingham',
      postalCode: 'B4 7SL',
    },
    location: {
      type: 'Point',
      coordinates: [-1.8904, 52.4862],
    },
    category: 'convenience',
    phone: '+44 121 236 2323',
    currency: 'GBP',
    averageRating: {
      salary: 3.8,
      restTime: 3.2,
      workEnv: 3.5,
      management: 3.6,
      overall: 3.53,
    },
    averageWage: {
      min: 10.42,
      max: 12.0,
      average: 11.0,
      count: 10,
    },
    reviewCount: 14,
  },
  {
    name: 'Primark Leeds',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '45 Briggate, Leeds LS1 6HD, UK',
      street: '45 Briggate',
      city: 'Leeds',
      postalCode: 'LS1 6HD',
    },
    location: {
      type: 'Point',
      coordinates: [-1.5437, 53.7997],
    },
    category: 'retail',
    phone: '+44 113 244 9393',
    currency: 'GBP',
    averageRating: {
      salary: 3.2,
      restTime: 2.8,
      workEnv: 3.0,
      management: 3.1,
      overall: 3.03,
    },
    averageWage: {
      min: 10.42,
      max: 11.0,
      average: 10.6,
      count: 12,
    },
    reviewCount: 18,
  },
  {
    name: 'Pret A Manger Bristol',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '1 The Horsefair, Bristol BS1 3JP, UK',
      street: '1 The Horsefair',
      city: 'Bristol',
      postalCode: 'BS1 3JP',
    },
    location: {
      type: 'Point',
      coordinates: [-2.5879, 51.4545],
    },
    category: 'cafe',
    phone: '+44 117 927 7272',
    currency: 'GBP',
    averageRating: {
      salary: 4.5,
      restTime: 4.2,
      workEnv: 4.3,
      management: 4.4,
      overall: 4.35,
    },
    averageWage: {
      min: 11.0,
      max: 14.0,
      average: 12.5,
      count: 7,
    },
    reviewCount: 9,
  },
  {
    name: 'Nando\'s Liverpool',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '14-16 Paradise St, Liverpool L1 3EU, UK',
      street: '14-16 Paradise St',
      city: 'Liverpool',
      postalCode: 'L1 3EU',
    },
    location: {
      type: 'Point',
      coordinates: [-2.9916, 53.4084],
    },
    category: 'restaurant',
    phone: '+44 151 709 6789',
    currency: 'GBP',
    averageRating: {
      salary: 3.9,
      restTime: 3.4,
      workEnv: 3.7,
      management: 3.8,
      overall: 3.7,
    },
    averageWage: {
      min: 10.42,
      max: 12.5,
      average: 11.3,
      count: 9,
    },
    reviewCount: 11,
  },
  {
    name: 'Sainsbury\'s Glasgow',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '180 Buchanan St, Glasgow G1 2JZ, UK',
      street: '180 Buchanan St',
      city: 'Glasgow',
      postalCode: 'G1 2JZ',
    },
    location: {
      type: 'Point',
      coordinates: [-4.2518, 55.8642],
    },
    category: 'convenience',
    phone: '+44 141 332 4567',
    currency: 'GBP',
    averageRating: {
      salary: 3.6,
      restTime: 3.3,
      workEnv: 3.4,
      management: 3.5,
      overall: 3.45,
    },
    averageWage: {
      min: 10.42,
      max: 11.8,
      average: 10.9,
      count: 11,
    },
    reviewCount: 16,
  },
  {
    name: 'Vue Cinema Edinburgh',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '130-131 Princes St, Edinburgh EH2 4AH, UK',
      street: '130-131 Princes St',
      city: 'Edinburgh',
      postalCode: 'EH2 4AH',
    },
    location: {
      type: 'Point',
      coordinates: [-3.194, 55.9533],
    },
    category: 'entertainment',
    phone: '+44 131 226 5678',
    currency: 'GBP',
    averageRating: {
      salary: 3.4,
      restTime: 3.1,
      workEnv: 3.5,
      management: 3.3,
      overall: 3.33,
    },
    averageWage: {
      min: 10.42,
      max: 11.2,
      average: 10.7,
      count: 5,
    },
    reviewCount: 7,
  },
  {
    name: 'Waterstones Cambridge',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '1-3 Trinity St, Cambridge CB2 1SU, UK',
      street: '1-3 Trinity St',
      city: 'Cambridge',
      postalCode: 'CB2 1SU',
    },
    location: {
      type: 'Point',
      coordinates: [0.1181, 52.2053],
    },
    category: 'retail',
    phone: '+44 1223 351688',
    currency: 'GBP',
    averageRating: {
      salary: 3.7,
      restTime: 3.6,
      workEnv: 4.0,
      management: 3.8,
      overall: 3.78,
    },
    averageWage: {
      min: 10.42,
      max: 11.5,
      average: 10.9,
      count: 4,
    },
    reviewCount: 5,
  },
];

/**
 * Seed 스크립트 실행
 */
async function seed() {
  try {
    // 데이터베이스 연결
    await connectDatabase();

    logger.info('🌱 Seed 스크립트 시작');

    // 시스템 사용자 조회 또는 생성
    let systemUser = await UserModel.findOne({ email: 'system@workreview.com' });

    if (!systemUser) {
      logger.info('시스템 사용자 생성 중...');
      systemUser = await UserModel.create({
        email: 'system@workreview.com',
        password: 'SystemPassword123!',
        name: 'System',
        role: 'admin',
      });
      logger.info('✅ 시스템 사용자 생성 완료');
    }

    // 기존 Store 데이터 삭제
    const deleteResult = await StoreModel.deleteMany({});
    logger.info(`🗑️  기존 데이터 ${deleteResult.deletedCount}개 삭제`);

    // Seed 데이터 삽입
    const stores = seedStores.map((store) => ({
      ...store,
      createdBy: systemUser!._id,
      isFromGooglePlaces: false,
    }));

    const insertedStores = await StoreModel.insertMany(stores);
    logger.info(`✅ ${insertedStores.length}개의 Store 데이터 생성 완료`);

    // 결과 출력
    console.log('\n📊 생성된 Store 데이터:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    insertedStores.forEach((store, index) => {
      console.log(
        `${index + 1}. ${store.name} (${store.address.city}) - ${store.category}`
      );
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    logger.info('🎉 Seed 완료!');
    logger.info('이제 http://localhost:5173/stores 에서 확인하세요!');

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
