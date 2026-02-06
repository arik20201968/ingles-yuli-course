import './style.css'
import { marked } from 'marked'

const COURSE_DATA = [
  {
    id: 'module_1',
    title: 'Module 1: First Steps',
    lessons: [
      { id: 'lesson_1_1', title: '1.1 Greetings & Farewells', file: 'modules/module_1/lesson_1_1.md' },
      { id: 'lesson_1_2', title: '1.2 Alphabet & Spelling', file: 'modules/module_1/lesson_1_2.md' },
      { id: 'lesson_1_3', title: '1.3 Numbers & Time', file: 'modules/module_1/lesson_1_3.md' },
      { id: 'lesson_1_4', title: '1.4 Colors & Objects', file: 'modules/module_1/lesson_1_4.md' },
    ]
  },
  {
    id: 'module_2',
    title: 'Module 2: The Core',
    lessons: [
      { id: 'lesson_2_1', title: '2.1 Verb "To Be"', file: 'modules/module_2/lesson_2_1.md' },
      { id: 'lesson_2_2', title: '2.2 Articles & Nouns', file: 'modules/module_2/lesson_2_2.md' },
      { id: 'lesson_2_3', title: '2.3 Possessive Adjectives', file: 'modules/module_2/lesson_2_3.md' },
      { id: 'lesson_2_4', title: '2.4 Question Words', file: 'modules/module_2/lesson_2_4.md' },
    ]
  },
  {
    id: 'module_3',
    title: 'Module 3: My World',
    lessons: [
      { id: 'lesson_3_1', title: '3.1 Family', file: 'modules/module_3/lesson_3_1.md' },
      { id: 'lesson_3_2', title: '3.2 Home & Furniture', file: 'modules/module_3/lesson_3_2.md' },
      { id: 'lesson_3_3', title: '3.3 Jobs & Work', file: 'modules/module_3/lesson_3_3.md' },
      { id: 'lesson_3_4', title: '3.4 Nationalities', file: 'modules/module_3/lesson_3_4.md' },
    ]
  },
  {
    id: 'module_4',
    title: 'Module 4: Actions',
    lessons: [
      { id: 'lesson_4_1', title: '4.1 Present Simple (Aff)', file: 'modules/module_4/lesson_4_1.md' },
      { id: 'lesson_4_2', title: '4.2 Negative & Questions', file: 'modules/module_4/lesson_4_2.md' },
      { id: 'lesson_4_3', title: '4.3 Common Verbs', file: 'modules/module_4/lesson_4_3.md' },
      { id: 'lesson_4_4', title: '4.4 Adverbs of Frequency', file: 'modules/module_4/lesson_4_4.md' },
    ]
  },
  {
    id: 'module_5',
    title: 'Module 5: Descriptions',
    lessons: [
      { id: 'lesson_5_1', title: '5.1 People & Things', file: 'modules/module_5/lesson_5_1.md' },
      { id: 'lesson_5_2', title: '5.2 City Places', file: 'modules/module_5/lesson_5_2.md' },
      { id: 'lesson_5_3', title: '5.3 Food & Drink', file: 'modules/module_5/lesson_5_3.md' },
      { id: 'lesson_5_4', title: '5.4 Weather & Seasons', file: 'modules/module_5/lesson_5_4.md' },
    ]
  }
];

const navElement = document.getElementById('course-nav');
const headerElement = document.getElementById('lesson-header');
const contentElement = document.getElementById('lesson-content');
const mainContent = document.getElementById('main-content'); // Define mainContent

let currentActiveLink = null;

function initNavigation() {
  if (!navElement) return;

  COURSE_DATA.forEach(module => {
    const group = document.createElement('div');
    group.className = 'module-group';

    const title = document.createElement('h2');
    title.className = 'module-title';
    title.textContent = module.title;
    group.appendChild(title);

    module.lessons.forEach(lesson => {
      const link = document.createElement('a');
      link.href = '#';
      link.className = 'lesson-link';
      link.textContent = lesson.title;
      link.onclick = (e) => {
        e.preventDefault();
        loadLesson(lesson, link);
      };
      group.appendChild(link);

      if (!currentActiveLink) {
        loadLesson(lesson, link);
      }
    });

    navElement.appendChild(group);
  });
}

function getCorrectPath(originalFile) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL.slice(0, -1)
    : import.meta.env.BASE_URL;

  const cleanFile = originalFile.startsWith('/') ? originalFile.substring(1) : originalFile;
  const fullPath = `${base}/${cleanFile}`.replace(/\/+/g, '/'); // Avoid double slashes
  return fullPath;
}

async function loadLesson(lesson, linkElement) {
  if (!contentElement || !headerElement) return; // Null check

  if (currentActiveLink) currentActiveLink.classList.remove('active');
  linkElement.classList.add('active');
  currentActiveLink = linkElement;

  contentElement.classList.remove('fade-in');
  contentElement.innerHTML = '<div class="loader-container"><p>Fetching lesson data...</p><div class="spinner"></div></div>';
  headerElement.innerHTML = `<h1>${lesson.title}</h1>`;

  const targetPath = getCorrectPath(lesson.file);
  const cacheBuster = `?v=${Date.now()}`;

  console.log('Course App: Fetch Path:', targetPath);

  try {
    const response = await fetch(targetPath + cacheBuster);
    if (!response.ok) throw new Error(`HTTP ${response.status} - Content not available at this path.`);
    const text = await response.text();

    const cleanText = text.replace(/^# .*\n/, '');
    contentElement.innerHTML = marked.parse(cleanText);
    contentElement.classList.add('fade-in');

    if (mainContent) mainContent.scrollTop = 0;

  } catch (error) {
    console.error('Course App: Loading failed:', error);
    contentElement.innerHTML = `
      <div class="error-card">
        <h3>Unable to load lesson content</h3>
        <p>We couldn't reach the lesson file: <strong>${lesson.title}</strong></p>
        
        <div class="error-details">
          <p><strong>Technical Info:</strong></p>
          <ul>
            <li>File: <code>${lesson.file}</code></li>
            <li>Resolved Path: <code>${targetPath}</code></li>
            <li>Error: ${error.message}</li>
          </ul>
        </div>

        <div class="error-actions">
          <button onclick="location.reload(true)" class="btn-primary">Force Reload App</button>
          <a href="https://github.com/arik20201968/ingles-yuli-course" target="_blank" class="btn-secondary">Check GitHub Status</a>
        </div>
        
        <p class="error-hint">If this persists, try clearing your browser cache or opening in Incognito mode.</p>
      </div>`;
  }
}

initNavigation();
