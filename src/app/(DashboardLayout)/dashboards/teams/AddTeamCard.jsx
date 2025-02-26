import { PlusCircle } from "lucide-react";

const AddTeamCard = ({ onClick }) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="
      group relative overflow-hidden
      bg-gradient-to-br from-gray-800 to-gray-900
      rounded-xl
      transition-all duration-300
      hover:shadow-lg hover:shadow-[#aa2180]
      hover:-translate-y-1
      focus:outline-none focus:ring-2 focus:ring-blue-500
      cursor-pointer w-full
      w-64 md:w-full h-46
    "
    >
      <div
        className="absolute inset-0 bg-[#aa2180] opacity-0 
                    group-hover:opacity-20 transition-opacity duration-300"
      />

      <div className="h-full flex flex-col items-center justify-center  p-4 gap-4">
        <div
          className="
         rounded-full bg-gray-700/50
        group-hover:bg-gray-500/20 
        transition-colors duration-300
      "
        >
          <PlusCircle
            className="w-10 h-10 text-[#aa2180] 
                              group-hover:text-[#aa2180] 
                              transition-colors duration-300"
          />
        </div>
        <span
          className="text-gray-300 font-medium 
                       group-hover:
                       transition-colors duration-300"
        >
          Ajouter une équipe
        </span>
      </div>
    </div>
  );
  export default AddTeamCard;