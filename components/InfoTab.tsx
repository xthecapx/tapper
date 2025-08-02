export default function InfoTab() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-center mb-4 text-gray-800">
        Información y Reglas 📋
      </h2>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
          <h3 className="font-bold text-blue-800 text-sm sm:text-base mb-2">📱 Cómo Usar:</h3>
          <ul className="text-xs sm:text-sm text-blue-700 space-y-1">
            <li>• Usa los dropdowns en "Seguimiento" para marcar tu estado diario</li>
            <li>• Ve los "Reyes" para ver quién es el peor en cada categoría</li>
            <li>• Revisa la "Tabla" para el ranking completo</li>
            <li>• Para agregar usuarios: ¡Solo regístrense!</li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-red-50 p-3 sm:p-4 rounded-lg border border-gray-300">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base mb-3">🏷️ Estados Diarios:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className="bg-green-100 p-2 rounded border border-green-300">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">✅</span>
                <span className="font-bold text-green-800">Limpio</span>
              </div>
              <p className="text-green-700">¡Día perfecto! Sin tapper y con ejercicio</p>
            </div>
            
            <div className="bg-orange-100 p-2 rounded border border-orange-300">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">🍔</span>
                <span className="font-bold text-orange-800">Tapper</span>
              </div>
              <p className="text-orange-700">Comiste mal pero al menos te ejercitaste</p>
            </div>
            
            <div className="bg-yellow-100 p-2 rounded border border-yellow-300">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">🥱</span>
                <span className="font-bold text-yellow-800">Perezoso</span>
              </div>
              <p className="text-yellow-700">Comiste bien pero no te ejercitaste</p>
            </div>
            
            <div className="bg-red-100 p-2 rounded border border-red-300">
              <div className="flex items-center mb-1">
                <span className="text-lg mr-2">💩</span>
                <span className="font-bold text-red-800">Desastre</span>
              </div>
              <p className="text-red-700">¡Lo peor! Tapper Y perezoso el mismo día</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 text-sm sm:text-base mb-2">⏰ Sistema de Tiempo:</h3>
          <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
            <li>• <span className="text-orange-600 font-bold">Competencia Semanal:</span> Cada lunes inicia una nueva competencia hasta el domingo</li>
            <li>• <span className="text-purple-600 font-bold">Mes:</span> Desde el día 1 del mes actual</li>
            <li>• <span className="text-blue-600 font-bold">Año:</span> Desde el 1 de enero</li>
            <li>• <span className="text-green-600 font-bold">🎉 Domingo:</span> ¡DÍA LIBRE! Los tappers y perezosos no cuentan como penalización</li>
          </ul>
        </div>

        <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 text-sm sm:text-base mb-2">👑 Sistema de Reyes:</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h4 className="font-bold text-red-700 mb-1">🍔 Reyes Tappers:</h4>
              <ul className="text-xs sm:text-sm text-red-700 space-y-1">
                <li>• 🗑️ Rey Semanal = Más tappers (lun-sáb)</li>
                <li>• 👑🐷 Rey Mensual = Más tappers del mes</li>
                <li>• 🏆💩 Rey Anual = Más tappers del año</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-yellow-700 mb-1">🥱 Reyes Slackers:</h4>
              <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                <li>• 🥱 Rey Semanal = Más perezoso (lun-sáb)</li>
                <li>• 👑🥱 Rey Mensual = Más perezoso del mes</li>
                <li>• 🏆🥱 Rey Anual = Más perezoso del año</li>
              </ul>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-red-700 mt-2 font-bold">¡Ser rey es ser una VERGÜENZA! 😈 Los domingos NO cuentan.</p>
        </div>

        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 text-sm sm:text-base mb-2">😈 Niveles de Vergüenza:</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h4 className="font-bold text-purple-700 mb-1">🍔 Shame Tapper:</h4>
              <div className="text-xs sm:text-sm space-y-1">
                <div>😇 = Angelito (0 tappers)</div>
                <div>😐 = Casi humano (1-2 tappers)</div>
                <div>🤡 = Sin control (3-5 tappers)</div>
                <div>🗑️ = Basura total (6+ tappers)</div>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-yellow-700 mb-1">🥱 Shame Slacker:</h4>
              <div className="text-xs sm:text-sm space-y-1">
                <div>💪 = Atleta (0 días perezosos)</div>
                <div>🥱 = Flojito (1-2 días)</div>
                <div>🛋️ = Perezoso (3-5 días)</div>
                <div>📺 = Adicto al sofá (6+ días)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 text-sm sm:text-base mb-2">💡 Consejos:</h3>
          <ul className="text-xs sm:text-sm text-green-700 space-y-1">
            <li>• Marca honestamente tu estado diario (comida y ejercicio)</li>
            <li>• Usa la vergüenza pública como motivación doble</li>
            <li>• ¡Comparte con tus amigos para máxima humillación!</li>
            <li>• El objetivo es ser ✅ Limpio todos los días</li>
            <li>• Evita ser 💩 Desastre - ¡es lo más vergonzoso!</li>
          </ul>
        </div>

        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg border border-orange-200">
          <h3 className="font-bold text-orange-800 text-sm sm:text-base mb-2">🤔 Preguntas Frecuentes:</h3>
          <div className="text-xs sm:text-sm text-orange-700 space-y-2">
            <div>
              <p className="font-semibold">¿Qué es un "tapper"?</p>
              <p>Un día donde comiste muy mal (comida chatarra, excesos, etc.)</p>
            </div>
            <div>
              <p className="font-semibold">¿Qué es un "slacker/perezoso"?</p>
              <p>Un día donde no hiciste ejercicio o actividad física</p>
            </div>
            <div>
              <p className="font-semibold">¿Los domingos cuentan como penalización?</p>
              <p>¡NO! Los domingos son días libres. Puedes marcarlos pero no afectan tu ranking 🎉</p>
            </div>
            <div>
              <p className="font-semibold">¿Puedo cambiar los días ya marcados?</p>
              <p>Sí, solo selecciona otro estado en el dropdown para cambiar</p>
            </div>
            <div>
              <p className="font-semibold">¿Puedo ser tapper Y perezoso el mismo día?</p>
              <p>Sí, ese es el estado "💩 Desastre" - ¡la máxima vergüenza!</p>
            </div>
            <div>
              <p className="font-semibold">¿Cómo agrego más amigos?</p>
              <p>Comparte el link de la app y que se registren</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-red-600 italic mt-4">
          "La verdadera vergüenza no es solo comer mal... ¡es comer mal Y ser perezoso el mismo día!" 🔥
        </div>
      </div>
    </div>
  )
}