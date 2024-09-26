import React, { useState } from "react";

const Settings: React.FC = () => {
    const [vibrationEnabled, setVibrationEnabled] = useState(true);
    const [animationEnabled, setAnimationEnabled] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (): void => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const handleDeleteAccount = (): void => {
        localStorage.clear(); // Clears all data from local storage
        closeModal();
        // You can add additional actions, such as redirecting or displaying a success message.
    };

    return (
        <div className="bg-black flex justify-center">
            <div className="w-full max-w-xl h-screen bg-black text-white p-6 space-y-6">
                <h1 className="text-3xl font-bold text-center">Настройки</h1>

                {/* Language Change */}
                <div className="bg-gray-800 rounded-2xl p-6 flex justify-between items-center cursor-pointer">
                    <span>Сменить язык</span>
                    <span className="text-gray-400">Русский</span>
                </div>

                {/* Exchange Change */}
                <div className="bg-gray-800 rounded-2xl p-6 flex justify-between items-center cursor-pointer">
                    <span>Сменить биржу</span>
                    <span className="text-gray-400">Bybit</span>
                </div>

                {/* Delete Account */}
                <div className="bg-gray-800 rounded-2xl p-6 flex justify-between items-center cursor-pointer" onClick={openModal}>
                    <span>Удалить аккаунт</span>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50" onClick={closeModal}>
                        <div className="bg-gray-500 w-full max-w-md rounded-t-2xl p-6 text-center text-white">
                            <h2 className="text-xl font-bold mb-4">Вы уверены, что хотите удалить свой аккаунт?</h2>
                            <p className="text-sm mb-6">
                                Все ваши данные, включая прогресс в игре, достижения и покупки, будут безвозвратно удалены. Это действие нельзя отменить.
                            </p>
                            <div className="space-y-4">
                                <button
                                    className="bg-red-600 text-white w-full py-3 rounded-lg text-lg font-semibold border border-slate-100"
                                    onClick={handleDeleteAccount}
                                >
                                    Удалить аккаунт
                                </button>
                                <button
                                    className="bg-gray-700 text-white w-full py-3 rounded-lg text-lg font-semibold border border-slate-100"
                                    onClick={closeModal}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Animation Toggle */}
                <div className="flex justify-between items-center p-4">
                    <span>Анимация</span>
                    <button
                        onClick={() => setAnimationEnabled(!animationEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${animationEnabled ? "bg-green-500" : "bg-gray-600"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${animationEnabled ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>

                {/* Privacy Policy */}
                <p className="text-center text-gray-400">Политика конфиденциальности</p>
            </div>
        </div>
    );
};

export default Settings;
