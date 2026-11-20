(() => {
  const demo = document.querySelector('#news-demo');
  if (!demo) return;

  // Fictional examples for exercising the notebook's search and deduplication workflow.
  const topics = {
    technology: [
      ['2025-03-15', ['Library tests a digital lending app', 'Una biblioteca prueba una aplicación de préstamo digital'], ['Readers can browse and reserve books from their phones.', 'Los lectores pueden buscar y reservar libros desde el teléfono.']],
      ['2025-03-14', ['Repair café teaches laptop maintenance', 'Un taller enseña mantenimiento de portátiles'], ['Volunteers show visitors how to clean and care for their devices.', 'Los voluntarios enseñan a limpiar y cuidar los dispositivos.']],
      ['2025-03-13', ['Students build a bus arrival display', 'Estudiantes crean una pantalla de llegadas de autobuses'], ['A prototype combines route data with a small public display.', 'Un prototipo combina datos de rutas con una pequeña pantalla pública.']],
      ['2025-03-12', ['Community center opens a coding lab', 'Un centro comunitario abre un laboratorio de programación'], ['The lab offers introductory workshops for new programmers.', 'El laboratorio ofrece talleres de iniciación a la programación.']],
      ['2025-03-11', ['Museum adds audio guides to its website', 'Un museo añade audioguías a su sitio web'], ['Visitors can open the guides from their own devices.', 'Los visitantes pueden abrir las guías desde sus dispositivos.']],
      ['2025-03-10', ['Library tests a digital lending app', 'Una biblioteca prueba una aplicación de préstamo digital'], ['An older entry repeats the same headline.', 'Una entrada anterior repite el mismo titular.']],
    ],
    science: [
      ['2025-03-15', ['Volunteers map pollinators in public parks', 'Voluntarios registran polinizadores en parques públicos'], ['The project tracks which flowers attract bees and butterflies.', 'El proyecto registra qué flores atraen abejas y mariposas.']],
      ['2025-03-14', ['Students compare water quality across a watershed', 'Estudiantes comparan la calidad del agua en una cuenca'], ['Teams collect samples from several sites along a river.', 'Los equipos toman muestras en varios lugares a lo largo de un río.']],
      ['2025-03-13', ['Observatory hosts a night-sky workshop', 'Un observatorio organiza un taller sobre el cielo nocturno'], ['Participants learn how to find planets and constellations.', 'Los participantes aprenden a localizar planetas y constelaciones.']],
      ['2025-03-12', ['Garden experiment tracks how mulch holds moisture', 'Un experimento de jardín mide cómo el mantillo retiene la humedad'], ['Volunteers compare watered plots over several weeks.', 'Los voluntarios comparan parcelas regadas durante varias semanas.']],
      ['2025-03-11', ['Museum demonstrates how fossils form', 'Un museo demuestra cómo se forman los fósiles'], ['A hands-on exhibit lets visitors make impressions in clay.', 'Una exposición práctica permite hacer impresiones en arcilla.']],
    ],
    sports: [
      ['2025-03-15', ['Recreation league opens spring registration', 'Una liga recreativa abre la inscripción de primavera'], ['Players can register for basketball, soccer, and volleyball.', 'Los jugadores pueden inscribirse en baloncesto, fútbol y voleibol.']],
      ['2025-03-14', ['Track club adds a beginner running group', 'Un club de atletismo añade un grupo de iniciación'], ['Weekly sessions introduce pacing and warm-up routines.', 'Las sesiones semanales enseñan a regular el ritmo y calentar.']],
      ['2025-03-13', ['Community gym hosts a youth basketball clinic', 'Un gimnasio comunitario organiza un taller juvenil de baloncesto'], ['Coaches lead drills on passing and movement.', 'Los entrenadores dirigen ejercicios de pases y movimiento.']],
      ['2025-03-12', ['Cycling club plans a weekend skills session', 'Un club de ciclismo organiza una sesión práctica de fin de semana'], ['The session covers braking and riding in groups.', 'La sesión trata sobre el frenado y la circulación en grupo.']],
      ['2025-03-11', ['Students organize a campus volleyball tournament', 'Estudiantes organizan un torneo universitario de voleibol'], ['Teams can sign up for a round-robin event.', 'Los equipos pueden inscribirse en un torneo de todos contra todos.']],
    ],
  };
  const topic = demo.querySelector('#news-topic');
  const search = demo.querySelector('#news-search');
  const status = demo.querySelector('#news-status');
  const results = demo.querySelector('#news-results');
  const row = demo.querySelector('template').content;
  const translate = label => window.portfolioTranslate?.(label) ?? label;
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

  function update() {
    const spanish = document.documentElement.lang === 'es';
    const language = spanish ? 1 : 0;
    const formatDate = new Intl.DateTimeFormat(spanish ? 'es' : 'en-US', {
      dateStyle: 'medium',
      timeZone: 'UTC',
    });
    const query = normalize(search.value.trim());
    const headlines = new Set();
    const entries = document.createDocumentFragment();

    for (const [date, title, description] of topics[topic.value]) {
      const headline = normalize(title[0]);
      if (headlines.has(headline)) continue;
      headlines.add(headline);
      if (!normalize(`${title.join(' ')} ${description.join(' ')}`).includes(query)) continue;

      const article = row.cloneNode(true);
      article.querySelector('h5').textContent = title[language];
      article.querySelector('p').textContent = description[language];
      const time = article.querySelector('time');
      time.dateTime = date;
      time.textContent = formatDate.format(new Date(date));
      entries.append(article);
      if (entries.childElementCount === 5) break;
    }

    const count = entries.childElementCount;
    results.replaceChildren(entries);
    status.textContent = count === 0
      ? translate('No sample articles match this search.')
      : translate(count === 1 ? '1 sample article' : '{count} sample articles').replace('{count}', count);
  }

  topic.addEventListener('change', update);
  search.addEventListener('input', update);
  document.addEventListener('languagechange', update);
  update();
  demo.hidden = false;
})();
