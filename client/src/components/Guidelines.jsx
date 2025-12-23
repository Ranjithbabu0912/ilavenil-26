import { rulesAndGuidelines } from '../assets/assets'


const Guidelines = () => {
    return (
        <div className='flex justify-center'>
            <div className='xl:w-3xl lg:w-2xl md:w-lg w-sm bg-white h-auto pb-10 mb-10 shadow-2xl border border-gray-200 rounded-xl flex items-center flex-col'>
                <h1 className='text-sm md:text-lg lg:text-xl xl:text-2xl text-center py-8 font-bold text-blue-700'>Rules & Guidelines</h1>

                <p className='text-xs md:text-sm text-center w-[80%] text-gray-400 mb-8'>Kindly read and adhere to all the guidelines to ensure a smooth event experience.</p>

                {/* rules and guidelines */}
                <div className='w-[80%]'>
                    {rulesAndGuidelines.map((index, rule) => (
                        <p className='mb-8 text-sm' key={index}> <span className='text-primary font-bold'>{rule + 1}. </span> {index}</p>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default Guidelines