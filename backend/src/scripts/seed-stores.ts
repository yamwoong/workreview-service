import mongoose from 'mongoose';
import { StoreModel } from '../models/Store.model';
import { UserModel } from '../models/User.model';
import { connectDatabase } from '../config/database';
import { logger } from '../config/logger';

/**
 * Store 시드 데이터
 * 초기 상태: 가게만 등록되어 있고 리뷰는 없음
 * 페이지네이션 테스트를 위해 30개 매장 추가
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
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
    reviewCount: 0,
  },
  {
    name: 'Greggs Newcastle',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '50 Northumberland St, Newcastle NE1 7DF, UK',
      street: '50 Northumberland St',
      city: 'Newcastle',
      postalCode: 'NE1 7DF',
    },
    location: {
      type: 'Point',
      coordinates: [-1.6131, 54.9783],
    },
    category: 'cafe',
    phone: '+44 191 232 1234',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'KFC Sheffield',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '28 High St, Sheffield S1 2GB, UK',
      street: '28 High St',
      city: 'Sheffield',
      postalCode: 'S1 2GB',
    },
    location: {
      type: 'Point',
      coordinates: [-1.4659, 53.3811],
    },
    category: 'restaurant',
    phone: '+44 114 272 3456',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Boots Pharmacy Cardiff',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '15 Queen St, Cardiff CF10 2AA, UK',
      street: '15 Queen St',
      city: 'Cardiff',
      postalCode: 'CF10 2AA',
    },
    location: {
      type: 'Point',
      coordinates: [-3.1791, 51.4816],
    },
    category: 'retail',
    phone: '+44 29 2034 5678',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Pizza Hut Nottingham',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '42 Clumber St, Nottingham NG1 3GA, UK',
      street: '42 Clumber St',
      city: 'Nottingham',
      postalCode: 'NG1 3GA',
    },
    location: {
      type: 'Point',
      coordinates: [-1.1499, 52.9548],
    },
    category: 'restaurant',
    phone: '+44 115 947 5678',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Subway Southampton',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '18 Above Bar St, Southampton SO14 7DZ, UK',
      street: '18 Above Bar St',
      city: 'Southampton',
      postalCode: 'SO14 7DZ',
    },
    location: {
      type: 'Point',
      coordinates: [-1.4044, 50.9097],
    },
    category: 'restaurant',
    phone: '+44 23 8063 4567',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'H&M Leicester',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '52 Gallowtree Gate, Leicester LE1 5AD, UK',
      street: '52 Gallowtree Gate',
      city: 'Leicester',
      postalCode: 'LE1 5AD',
    },
    location: {
      type: 'Point',
      coordinates: [-1.1383, 52.6369],
    },
    category: 'retail',
    phone: '+44 116 251 6789',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Wagamama Brighton',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '11 North St, Brighton BN1 1EB, UK',
      street: '11 North St',
      city: 'Brighton',
      postalCode: 'BN1 1EB',
    },
    location: {
      type: 'Point',
      coordinates: [-0.1406, 50.8225],
    },
    category: 'restaurant',
    phone: '+44 1273 688899',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Caffe Nero York',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '28 Coney St, York YO1 9ND, UK',
      street: '28 Coney St',
      city: 'York',
      postalCode: 'YO1 9ND',
    },
    location: {
      type: 'Point',
      coordinates: [-1.0827, 53.9591],
    },
    category: 'cafe',
    phone: '+44 1904 622333',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Odeon Cinema Plymouth',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: 'Derry\'s Cross, Plymouth PL1 2SW, UK',
      street: 'Derry\'s Cross',
      city: 'Plymouth',
      postalCode: 'PL1 2SW',
    },
    location: {
      type: 'Point',
      coordinates: [-4.1427, 50.3755],
    },
    category: 'entertainment',
    phone: '+44 1752 266123',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Whole Foods Bath',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '12 Milsom St, Bath BA1 1DE, UK',
      street: '12 Milsom St',
      city: 'Bath',
      postalCode: 'BA1 1DE',
    },
    location: {
      type: 'Point',
      coordinates: [-2.3599, 51.3811],
    },
    category: 'convenience',
    phone: '+44 1225 337788',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'TGI Fridays Reading',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: 'The Oracle, Reading RG1 2AG, UK',
      street: 'The Oracle',
      city: 'Reading',
      postalCode: 'RG1 2AG',
    },
    location: {
      type: 'Point',
      coordinates: [-0.9781, 51.4543],
    },
    category: 'restaurant',
    phone: '+44 118 959 5555',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Zara Aberdeen',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '75 Union St, Aberdeen AB11 6BA, UK',
      street: '75 Union St',
      city: 'Aberdeen',
      postalCode: 'AB11 6BA',
    },
    location: {
      type: 'Point',
      coordinates: [-2.0969, 57.1497],
    },
    category: 'retail',
    phone: '+44 1224 588899',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Five Guys Portsmouth',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '34 Commercial Rd, Portsmouth PO1 1ES, UK',
      street: '34 Commercial Rd',
      city: 'Portsmouth',
      postalCode: 'PO1 1ES',
    },
    location: {
      type: 'Point',
      coordinates: [-1.0934, 50.7984],
    },
    category: 'restaurant',
    phone: '+44 23 9283 7777',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Cineworld Swindon',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: 'Greenbridge Retail Park, Swindon SN3 3LF, UK',
      street: 'Greenbridge Retail Park',
      city: 'Swindon',
      postalCode: 'SN3 3LF',
    },
    location: {
      type: 'Point',
      coordinates: [-1.7749, 51.5557],
    },
    category: 'entertainment',
    phone: '+44 1793 484888',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Marks & Spencer Norwich',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '18-20 Gentleman\'s Walk, Norwich NR2 1NA, UK',
      street: '18-20 Gentleman\'s Walk',
      city: 'Norwich',
      postalCode: 'NR2 1NA',
    },
    location: {
      type: 'Point',
      coordinates: [1.2929, 52.6309],
    },
    category: 'retail',
    phone: '+44 1603 660744',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Burger King Derby',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '12 St Peter\'s St, Derby DE1 1SH, UK',
      street: '12 St Peter\'s St',
      city: 'Derby',
      postalCode: 'DE1 1SH',
    },
    location: {
      type: 'Point',
      coordinates: [-1.4759, 52.9225],
    },
    category: 'restaurant',
    phone: '+44 1332 345678',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Yo! Sushi Hull',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '45 Prospect St, Hull HU2 8PW, UK',
      street: '45 Prospect St',
      city: 'Hull',
      postalCode: 'HU2 8PW',
    },
    location: {
      type: 'Point',
      coordinates: [-0.3349, 53.7456],
    },
    category: 'restaurant',
    phone: '+44 1482 224488',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Topshop Exeter',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '238 High St, Exeter EX4 3PZ, UK',
      street: '238 High St',
      city: 'Exeter',
      postalCode: 'EX4 3PZ',
    },
    location: {
      type: 'Point',
      coordinates: [-3.5339, 50.7236],
    },
    category: 'retail',
    phone: '+44 1392 421900',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Nando\'s Coventry',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '58 Hertford St, Coventry CV1 1LF, UK',
      street: '58 Hertford St',
      city: 'Coventry',
      postalCode: 'CV1 1LF',
    },
    location: {
      type: 'Point',
      coordinates: [-1.5088, 52.4081],
    },
    category: 'restaurant',
    phone: '+44 24 7663 3399',
    currency: 'GBP',
    reviewCount: 0,
  },
  {
    name: 'Starbucks Belfast',
    address: {
      country: 'GB',
      countryName: 'United Kingdom',
      formatted: '12 Donegall Place, Belfast BT1 5AD, UK',
      street: '12 Donegall Place',
      city: 'Belfast',
      postalCode: 'BT1 5AD',
    },
    location: {
      type: 'Point',
      coordinates: [-5.9301, 54.5973],
    },
    category: 'cafe',
    phone: '+44 28 9024 4455',
    currency: 'GBP',
    reviewCount: 0,
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

    // 기존 Store 데이터 삭제 (리뷰가 없는 매장만 삭제)
    const deleteResult = await StoreModel.deleteMany({ reviewCount: 0 });
    logger.info(`🗑️  기존 데이터 ${deleteResult.deletedCount}개 삭제 (리뷰가 있는 매장은 유지)`);

    // Seed 데이터 삽입
    const stores = seedStores.map((store) => ({
      ...store,
      createdBy: systemUser!._id,
      isFromGooglePlaces: false,
    }));

    const insertedStores = await StoreModel.insertMany(stores);
    logger.info(`✅ ${insertedStores.length}개의 Store 데이터 생성 완료`);

    // 전체 매장 수 조회 (리뷰가 있는 매장 포함)
    const totalStores = await StoreModel.countDocuments();

    // 결과 출력
    console.log('\n📊 생성된 Store 데이터:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    insertedStores.forEach((store, index) => {
      console.log(
        `${index + 1}. ${store.name} (${store.address.city}) - ${store.category}`
      );
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n총 매장 수: ${totalStores}개 (리뷰가 있는 기존 매장 포함)\n`);

    logger.info('🎉 Seed 완료!');
    logger.info(`총 ${totalStores}개 매장 (리뷰가 있는 기존 매장 유지됨)`);
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
