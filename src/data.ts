import { Route, Bus, Offer, Transaction, Passenger } from './types';

export const IMAGES = {
  splashBusCard: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfgkoJcn3EemguLKu-YkNA21MWJYWW3qvFdhJ5DNyIAHd0JwIqw8c0zawbJp1FM6VFEeMFQ8Kh0VDMRTjuT0nqZE0jn-r-v8K0gmELwDTdDFGtC7FX4DQAngFZVWpDejmWCkI8dP7maQntY0mjMI991DN1qwTIFixEULe-MAhFNnHDZnV1itr2qBi6_H6PGrGXMHRpdvwj8hJ8IBS1ys1h12ozr5bsxeUtLUvI-0jx1ttZ4R-t2ESk8A",
  onboardingBus: "https://lh3.googleusercontent.com/aida-public/AB6AXuCNY7eFuLYZrhc-AvUMgARhNx6GOC1HjyeWM3Z6AyBH2_3bp1XDoWTq0jyP8BnOZmmMb3RRaveyiC5EMMxIEzzTM2rUyTRJu43FU69Ht9LJhwx4ua4olOPWQs69UchPb15cOPjmefAHPFI8JNiPsbuX3PeAgu4cMbN4yGuyVieUMUyQG9_aqusyi-IL3AU8QvmMlCdac0pj4X0eCCzMef0g_unkw4GqzIfZQyxGkma0vFHbWZ0FRFK9Gg",
  userHeaderAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDh6FlGw3Q1PoyWt9xOK1dT6q-InUU87EtykLLqQusKQAg8mBnj_YFCjuL8S7ogAhn6jofcxAPL0tQyUUzNAFDeNJ5O60z0MPylj79_BcpIMeHijIAh6KTtfNYMm1fQZpk1nflLs2jQxEBud9R1U9f-DYxnqBxINH75ZJPvphAb7Z2NNbCh0UN6yv76SPELZKFxuoYqFw5cOgbPPpKiu65iCptr9CY2_WLsAoR5_NLi7Qp5LwXsm-4ocA",
  searchBackdrop: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7wKT1lsdxPRfagJiyqD-w32zyLxuAoxF5B88LRYS8-WOP-GheXi88oNzEsqA8rTjOCJfCKO5ncQ29rAiCEnLEZDpGrNmMcp39kKGWJUBEwXWXcFNDKdZ4iAM4EKKUP-O4pBIziZIzjoLbcK34GlWNDMlR3g9K7SfPhpTh-5djxl9yCE35zJVMWssrTz9pNE2CSsS6k-F-9uDfJfiB21eLGULR6xo5-Cb_-Irl2brfPyflStoPYU_LPg",
  offer1: "https://lh3.googleusercontent.com/aida-public/AB6AXuCd8ckx3wOU3gVGL-FH5VhOoQXZT0AilKvcYw9V48HiHcQ9Ovrw-ZbEvA64Cd_ktYaht_Du8lqo-xKnB7MHOi6zwuHwRfM29CuhCqtUB-BEINZYWlm2KZ5OwA2HVD6Kd8BB29kMMR7eSfzysffsFrQP-ylijGjy7X8Gf8lfXe8TwGLXwRdy4p_N0zZjosT9jh3hqI3mkq7sy6ti4atLLr5wwrAOJEfQ_uglGvPsO961DIZ2yzwB_g243A",
  offer2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBrTvG6sdvXGbUcwFMVKsNddBDGXY40im8wDBFxVzj8oXTMkNjLT-dQvWKALuPIrDisSoZvNcUlmbMi8uaoMEV-YlGWQ3CHbSzeG4uk9V8thnDMQRYKt20E1lyy1YHdBO3jaSF2qRn-SjBtWZWPdOT42ImznePKMgWpzJ2Geqme_Bt8YteQxkup_OCS39eHtRO5yuL4diTnFmJLnJhbAhNOmUaiKEci_k6MPZjJlASbgNRalI-WIXkHrg",
  starTravelsLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7rwyM0L_cjC6goAbH5-yhJ1wfFjR6RvXn4XGC_k9WVV3KaMwoZMJv2I6RJAYhQPyDANlOSDL-ZhLKzwalS0pgNxx--2rvgX9lFs818Go5hewbmFpJPjxjeGEyegUT46wHxfXvKpi2dWJFIMHifVBwwMt_Hc1lF3Pn_rrgQHcMi3mDNhm9TXRV57t3Xo-IxezdXWG9FFO-hyzfpZfy9NuP6S9HZwjot24sGe4Yd-dqcz8AB5rUkukkqg",
  blueLinesLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuOxg_jnGgma0_5XbmxzAkhhNJHboVXyMiGLo7AXgK5XAHGLKhx8lSaZ65VA6HWW_YdYdgkk4QnM-NA2qCadQ0asF25s6O9iYKFroO0TsYf66-Zh0D4KutnGDv_kRo88hvJ2PGrmnZX_IO-nZmy82qBc2ZgArAn_LfQWsm47nf2oaCC6tLUCxt_riAV5BRpGtUktKrZh8fgIEEBdukPtXomdaDlc3RpFSgrHwfcoKaBgXOyz_O9Ww1nA",
  atlasExpressLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDc1NZpFunJHhgNkLxmqjpSeAMY6NkjYyF8bl1I7iGtpfYnuwdEsYC0bfmpbVH3bY0s6tDVjv82pSNR2S4AwzJmEZfXYO_-ajip9l8aIRoRwCCpuvtYJb_OulWqCijguAOBf5iCbILEKMG5nPD-n9JDixk-e61aQ_9vmrbhefCvuCWnaH4pvqeHfbOsNrEc4wKKkhb6cD32UOp9MbszFAJ_f4eqfdSljYUMKaNlaKqJJlSHKF_6ohcNaA",
  alexJohnsonAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDcaOKlf3YBPbPekBuDwkETRJTk3ZRpryt9U2NVeGUsz1au3KRaRjS0cuhGwsiB2dALwZ2mojh0HKx1NsAGMzUmm56OIF49l-K12oi0VUItLXX04Kif3X70WGFUxi30dYQp5dJ60jojkcdkDBWPYdSPCSYQWt1jBAoAqE4ExzFBDhor5VLn5HH1BG78V6wD12vveemqq5Q5DI6-30iByFtR9NM-PUzkfAnRd483yVM2r10gAqW38zriw",
  alexJohnsonAvatarStudio: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1Lrfq-w7fDIloicNAdV9rSdOgnxEFWD1yTejWY-QfOPXtAaRgI6m-Nsxk2HXQp7mzwR9PCc3OED9R1GBbkjhx69TBO3WIZTXumeStGEm7CmF7aUZGMF3mOhzxTwLJJ0LhVN4VlBy1EjN7UrSxz3BllqqASEHEJme16iPiKI4o3T9XUh-lZgmONulF-hV3nTb5TqhRUiUuw5vv51VKu0g6-IKvm1Ll0UUT9CsoNUyW1IToMoskdx72fg",
  walletHeaderIcon: "https://lh3.googleusercontent.com/aida-public/AB6AXuBU2axgtKnCFdHJSrS9I47CmLuPLZZxpZeFjy2438B2tTcHxOaCruUPKtMqRGcynKqY8J9z1_Bwk7Kx8wmDHS6obVcn6R9ki9mkxGHZxtP5PLTxMEJusk82wQhief1IqiM1yxPDGOE2fUI3ZK2NPFubqi6iNx6JOfU93uqES1uUdfSd0-KUrTtbIbTLJw-ZchZwQ-UuIgWjANFW9a8oP-108Y6a-Jk0xVNgBLbz9fkY73JPw9QvVJx-UQ",
  supportAgent: "https://lh3.googleusercontent.com/aida-public/AB6AXuDB5NFAgjY_eXJ1M_PZn710NdKpOFp9dMPJuTCf8gCzd4Zy3dZGey8ByY1NtNeKWLY-gH056kjodTJsUA7HRa6sJxptAKsr0hDdngklUcKvWTLh7SVSq5seS2nsPHLO2vK_i5AaZE4Y7y7GuGYF1JXHjI0vkCsNZNDz9REVioYEQbzN5ug8tj-S_1mX0etKO5dnKqV07rn1J67QIVPex7NeAZ3j9fAi8YTI1wtW-APiQy0e2ePP4OeWcQ"
};

export const POPULAR_ROUTES: Route[] = [
  { id: '1', from: 'New York', to: 'Boston', dailyBuses: 45, price: 25 },
  { id: '2', from: 'LA', to: 'Las Vegas', dailyBuses: 32, price: 39 },
  { id: '3', from: 'SF', to: 'Seattle', dailyBuses: 12, price: 55 },
  { id: '4', from: 'London', to: 'Edinburgh', dailyBuses: 20, price: 35 },
  { id: '5', from: 'Manchester', to: 'London', dailyBuses: 15, price: 28 },
];

export const BUSES: Bus[] = [
  {
    id: 'bus-1',
    operator: 'Star Travels',
    operatorLogo: IMAGES.starTravelsLogo,
    type: 'Volvo AC Multi-Axle',
    rating: 4.8,
    departureTime: '06:30',
    departureCity: 'London',
    arrivalTime: '14:45',
    arrivalCity: 'Edinburgh',
    duration: '8h 15m',
    amenities: ['wifi', 'power', 'water'],
    seatsLeft: 12,
    price: 45.00
  },
  {
    id: 'bus-2',
    operator: 'Blue Lines',
    operatorLogo: IMAGES.blueLinesLogo,
    type: 'Luxury Sleeper AC',
    rating: 4.5,
    departureTime: '22:00',
    departureCity: 'London',
    arrivalTime: '07:00',
    arrivalCity: 'Edinburgh',
    duration: '9h 00m',
    amenities: ['bed', 'ac', 'power'],
    seatsLeft: 5,
    price: 58.50
  },
  {
    id: 'bus-3',
    operator: 'Atlas Express',
    operatorLogo: IMAGES.atlasExpressLogo,
    type: 'Semi-Sleeper AC',
    rating: 4.2,
    departureTime: '09:15',
    departureCity: 'London',
    arrivalTime: '17:45',
    arrivalCity: 'Edinburgh',
    duration: '8h 30m',
    amenities: ['chair', 'usb', 'ac'],
    seatsLeft: 22,
    price: 32.00
  },
  {
    id: 'bus-4',
    operator: 'Star Travels',
    operatorLogo: IMAGES.starTravelsLogo,
    type: 'Premium Executive Coach',
    rating: 4.9,
    departureTime: '13:00',
    departureCity: 'London',
    arrivalTime: '21:30',
    arrivalCity: 'Edinburgh',
    duration: '8h 30m',
    amenities: ['wifi', 'power', 'water', 'usb'],
    seatsLeft: 8,
    price: 49.99
  }
];

export const OFFERS: Offer[] = [
  {
    id: 'offer-1',
    badge: 'First Trip Offer',
    title: 'Get 30% Off Your First Ride',
    subtitle: 'Use code: TRAVELNEW',
    code: 'TRAVELNEW',
    image: IMAGES.offer1,
    bgGradient: 'from-blue-900/90 to-transparent'
  },
  {
    id: 'offer-2',
    badge: 'Flash Sale',
    title: 'Weekend Getaway Hot Deals',
    subtitle: 'Starts from $19.99',
    price: '$19.99',
    image: IMAGES.offer2,
    bgGradient: 'from-sky-900/90 to-transparent'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Trip to Manchester',
    date: '24 Oct • Bus Booking',
    type: 'booking',
    amount: -42.00,
    status: 'Success'
  },
  {
    id: 'tx-2',
    title: 'Cashback Reward',
    date: '22 Oct • Referral Bonus',
    type: 'bonus',
    amount: 10.00,
    status: 'Credited'
  },
  {
    id: 'tx-3',
    title: 'Wallet Top-up',
    date: '19 Oct • Via Visa ****1234',
    type: 'topup',
    amount: 50.00,
    status: 'Success'
  },
  {
    id: 'tx-4',
    title: 'Trip to Edinburgh',
    date: '15 Oct • Bus Booking',
    type: 'booking',
    amount: -35.50,
    status: 'Success'
  }
];

export const INITIAL_PASSENGERS: Passenger[] = [
  { id: 'p-1', name: 'Mark J.', initials: 'MJ', bgClass: 'bg-indigo-100 dark:bg-indigo-950/55', textClass: 'text-indigo-600 dark:text-indigo-400' },
  { id: 'p-2', name: 'Lily J.', initials: 'LJ', bgClass: 'bg-rose-100 dark:bg-rose-950/55', textClass: 'text-rose-600 dark:text-rose-400' },
  { id: 'p-3', name: 'Sam R.', initials: 'SR', bgClass: 'bg-teal-100 dark:bg-teal-950/55', textClass: 'text-teal-600 dark:text-teal-400' }
];

export const FAQS = [
  {
    question: "How do I cancel my bus ticket?",
    answer: "You can cancel your ticket directly through the 'My Trips' section in the bottom navigation. Simply select your active upcoming ticket and click 'Cancel Booking'. Note that operators may apply cancellation fees according to their terms (e.g. 100% refund if cancelled > 24 hours prior)."
  },
  {
    question: "What is TravelGo Wallet?",
    answer: "TravelGo Wallet is an integrated digital secure ledger system where you can load money via debit/credit card or UPI, receive cashback rewards, and issue instant refunds. You can use your balance to book tickets with a single click."
  },
  {
    question: "Can I change my seat after booking?",
    answer: "Once a booking is finalized, seats are reserved directly on the coach manifest. If you require a modifications, please contact our support desk through the Support tab live chat. Our agents can request seat reassignments directly from operators."
  },
  {
    question: "How does referral bonus work?",
    answer: "When a friend signs up using your custom link or referral code, they receive £5 in their TravelGo Wallet. Once they complete their first trip, you'll be credited with a £10 referral bonus directly into your wallet!"
  }
];
