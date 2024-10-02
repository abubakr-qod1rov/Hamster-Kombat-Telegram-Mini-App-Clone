import React, { useState, useEffect } from 'react';
import '../App.css';
import Hamster from '../icons/Hamster';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from '../images';
import Info from '../icons/Info';
import Settings from '../icons/Settings';
import Mine from '../icons/Mine';
import Friends from '../icons/Friends';
import Coins from '../icons/Coins';
import { FaHeart } from "react-icons/fa6";
import { Link } from 'react-router-dom';

import RankVid from "../assets/RankVid.mp4"




const Game: React.FC = () => {

  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];


  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(() => {
    const savedPoints = localStorage.getItem('points');
    return savedPoints ? parseInt(savedPoints, 10) : 2000;
  });

  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const pointsToAdd = 11;
  const profitPerHour = 1000000;
  const [offlinePoints, setOfflinePoints] = useState<number>(0);


  useEffect(() => {
    localStorage.setItem('points', points.toString());
  }, [points]);



  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }



    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };



  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };


  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }


  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  const formatOfflinePoints = (points: number) => {
    if (points >= 1000000000) return `${(points / 1000000000).toFixed(2)}B`;
    if (points >= 1000000) return `${(points / 1000000).toFixed(2)}M`;
    if (points >= 1000) return `${(points / 1000).toFixed(2)}K`;
    return `${points}`;
  };

  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const lastExitTime = localStorage.getItem('lastExitTime');

    if (lastExitTime) {
      const timeDifference = (Date.now() - parseInt(lastExitTime)) / 1000;
      const calculatedOfflinePoints = Math.floor(pointsPerSecond * timeDifference);

      // Offline ballar hisoblanishi
      if (calculatedOfflinePoints > 0) {
        setOfflinePoints(calculatedOfflinePoints); // Offline ballarni saqlaymiz
        setPoints(prevPoints => prevPoints + calculatedOfflinePoints); // Yana ballarni yangilaymiz
        setShowModal(true); // Modalni ko'rsatamiz
      }
    }else {
      setShowModal(true);
    }

    // Ballarni har sekundda hisoblash
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);

    // Sahifadan chiqayotganda vaqtni saqlash
    return () => {
      localStorage.setItem('lastExitTime', Date.now().toString());
      clearInterval(interval);
    };
  }, [profitPerHour]);



  const [showModal, setShowModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);


  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
      setShowRankModal(true);
      setIsAnimating(true);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const closeRankModal = () => setShowRankModal(false);
  const closeModal = () => setShowModal(false);

  return (
    <div className="bg-black flex justify-center h-screen overflow-hidden">
      <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-md">
        <div className="px-4 z-10">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">Akbar</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">
                    {levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span>
                  </p>
                </div>

                {showRankModal && (
                  <div className={`fixed inset-0 bg-blue-500 bg-opacity-75 flex justify-center items-center rounded transition-transform duration-1000 transform ${isAnimating ? 'scale-1000' : 'scale-0'}`}>
                    <div className="p-6 rounded">
                      <video width="400" autoPlay className="mt-4 rounded-full">
                        <source src={RankVid} type="video/mp4" />
                      </video>
                      <p className='text-white text-center pt-10 text-2xl'>
                        Siz <span className='text-red-500 font-black'>{levelNames[levelIndex]}</span> darajasiga erishdingiz
                      </p>
                      
                    <button
                      className="bg-[#000] text-white w-full py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2 mt-5"
                      onClick={closeRankModal}
                    >
                      Спасибо <FaHeart />
                    </button>
                    </div>
                  </div>
                )}



                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div
                      className="progress-gradient h-2 rounded-full"
                      style={{ width: `${calculateProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
              <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
              <Link to="/settings">
                <Settings className="text-white cursor-pointer" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
          <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
            <div className="px-4 mt-6 flex justify-between gap-2">
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative cursor-pointer">
                <div className="dot"></div>
                <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyRewardTimeLeft}
                </p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative cursor-pointer">
                <div className="dot"></div>
                <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyCipherTimeLeft}
                </p>
              </div>
              <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative cursor-pointer">
                <div className="dot"></div>
                <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
                <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
                <p className="text-[10px] font-medium text-center text-gray-400 mt-2">
                  {dailyComboTimeLeft}
                </p>
              </div>
            </div>

            <div className="px-4 mt-4 flex justify-center">
              <div className="px-4 py-2 flex items-center space-x-2">
                <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
                <p className="text-4xl text-white">{points.toLocaleString()}</p>
              </div>
            </div>

            {showModal && (
              <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-10" onClick={closeModal}>
                <div className="bg-[#0d1b2a]  w-full max-w-md h-[55vh] rounded-t-3xl p-6 text-center text-white border-t-2 border-yellow-300">
                  <div className='p-8 bg-[#1b263b] mb-6 rounded-3xl'>
                    <div className='flex items-center justify-center gap-2 mb-5'>
                      <img src={dollarCoin} alt="Dollar Coin" className="w-14 h-14" />
                      <h2 className="text-5xl font-bold">{formatOfflinePoints(offlinePoints)}</h2>
                    </div>
                    <p className="text-lg">
                      Akbar Kombat начал работать для вас
                    </p>
                  </div>
                  <div className="space-y-4">
                    <button
                      className="bg-[#0077b6] text-white w-full py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-2"
                      onClick={closeModal}
                    >
                      Спасибо, Akbar Kombat <FaHeart />
                    </button>
                  </div>
                </div>
              </div>
            )}


            <div className="px-4 mt-4 flex justify-center">
              <div
                className="w-80 h-80 p-4 rounded-full circle-outer cursor-pointer"
                onClick={handleCardClick}
              >
                <div className="w-full h-full rounded-full circle-inner">
                  <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fixed div */}
      <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#272a2f] flex justify-around items-center ${showModal ? 'z-[-1]' : 'z-10'} rounded-2xl text-xs`}>
        <div className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl cursor-pointer">
          <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Exchange</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5 cursor-pointer">
          <Mine className="w-8 h-8 mx-auto" />
          <p className="mt-1">Mine</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5 cursor-pointer">
          <Friends className="w-8 h-8 mx-auto" />
          <p className="mt-1">Friends</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5 cursor-pointer">
          <Coins className="w-8 h-8 mx-auto" />
          <p className="mt-1">Earn</p>
        </div>
        <div className="text-center text-[#85827d] w-1/5 cursor-pointer">
          <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
          <p className="mt-1">Airdrop</p>
        </div>
      </div>

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 0.5s ease-out`,
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
  );
};

export default Game;
