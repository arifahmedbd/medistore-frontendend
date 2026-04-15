interface CategoryCardProps {
  title: string;
  icon: React.ReactNode;
}

export const CategoryCard = ({ title, icon }: CategoryCardProps) => (
  <div className="group relative p-6 rounded-2xl backdrop-blur-xl bg-white/40 dark:bg-white/10 border border-white/20 
                  hover:shadow-xl hover:scale-105 transition-transform cursor-pointer">
    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-500/10 to-green-400/10" />

    <div className="relative z-10 text-center">
      <div className="h-16 w-16 mx-auto mb-4 rounded-full flex items-center justify-center 
                      bg-gradient-to-br from-blue-400 to-green-400 p-1">
        <div className="bg-white dark:bg-gray-800 h-full w-full rounded-full flex items-center justify-center text-blue-600">
          {icon}
        </div>
      </div>

      <h3 className="font-medium text-foreground">{title}</h3>
    </div>
  </div>
);