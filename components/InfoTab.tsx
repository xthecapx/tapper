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
            <li>• Toca los círculos en "Seguimiento" para marcar días de tapper</li>
            <li>• Ve los "Reyes" para ver quién es el peor de cada período</li>
            <li>• Revisa la "Tabla" para el ranking completo</li>
            <li>• Para agregar usuarios: ¡Solo regístrense!</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-yellow-800 text-sm sm:text-base mb-2">⏰ Sistema de Tiempo:</h3>
          <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
            <li>• <span className="text-orange-600 font-bold">Semana:</span> Últimos 7 días</li>
            <li>• <span className="text-purple-600 font-bold">Mes:</span> Desde el día 1 del mes actual</li>
            <li>• <span className="text-blue-600 font-bold">Año:</span> Desde el 1 de enero</li>
            <li>• <span className="text-red-600 font-bold">Total:</span> Desde que te registraste</li>
          </ul>
        </div>

        <div className="bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200">
          <h3 className="font-bold text-red-800 text-sm sm:text-base mb-2">👑 Sistema de Reyes:</h3>
          <ul className="text-xs sm:text-sm text-red-700 space-y-1">
            <li>• Los <strong>REYES</strong> son los que <strong>MÁS</strong> tappers tienen</li>
            <li>• 🗑️ Rey de la Semana = Peor de los últimos 7 días</li>
            <li>• 👑🐷 Rey del Mes = Peor del mes actual</li>
            <li>• 🏆💩 Rey del Año = Peor del año</li>
            <li>• ¡Ser rey es ser una VERGÜENZA! 😈</li>
          </ul>
        </div>

        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg border border-purple-200">
          <h3 className="font-bold text-purple-800 text-sm sm:text-base mb-2">😈 Niveles de Vergüenza:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
            <div>😇 = Santo (0 tappers)</div>
            <div>😐 = Casi humano (1-2 tappers)</div>
            <div>🤡 = Sin control (3-5 tappers)</div>
            <div>🐷 = Adicto total (6-10 tappers)</div>
            <div className="sm:col-span-2">🗑️ = Basura humana (11+ tappers)</div>
          </div>
        </div>

        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200">
          <h3 className="font-bold text-green-800 text-sm sm:text-base mb-2">💡 Consejos:</h3>
          <ul className="text-xs sm:text-sm text-green-700 space-y-1">
            <li>• Marca honestamente tus días de tapper</li>
            <li>• Usa la vergüenza pública como motivación</li>
            <li>• ¡Comparte con tus amigos para máxima humillación!</li>
            <li>• El objetivo es NO ser rey de nada 😅</li>
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
              <p className="font-semibold">¿Puedo cambiar los días ya marcados?</p>
              <p>Sí, solo toca el círculo de nuevo para cambiar el estado</p>
            </div>
            <div>
              <p className="font-semibold">¿Cómo agrego más amigos?</p>
              <p>Comparte el link de la app y que se registren</p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-red-600 italic mt-4">
          "No hay nada más patético que alguien que no puede controlar sus antojos" 🔥
        </div>
      </div>
    </div>
  )
} 