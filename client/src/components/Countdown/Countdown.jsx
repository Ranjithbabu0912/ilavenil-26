const Countdown = ({ timeLeft }) => {
    if (!timeLeft) {
        return (
            <p className="mt-6 text-center text-red-600 font-semibold text-lg">
                🚫 Registration Closed
            </p>
        );
    }

    const format = (num) => String(num).padStart(2, "0");

    return (
        <div className="mt-6 flex justify-center">
            <div className="
        flex items-center gap-2 sm:gap-3
        text-gray-800
        text-sm sm:text-base md:text-lg
        font-semibold
        tracking-wide
      ">
                <span className="text-gray-600">
                    Registration ends in:
                </span>

                <span className="font-bold">
                    {format(timeLeft.days)}
                </span>
                <span>:</span>

                <span className="font-bold">
                    {format(timeLeft.hours)}
                </span>
                <span>:</span>

                <span className="font-bold">
                    {format(timeLeft.minutes)}
                </span>
                <span>:</span>

                <span className="font-bold">
                    {format(timeLeft.seconds)}
                </span>
            </div>
        </div>
    );
};

export default Countdown;
