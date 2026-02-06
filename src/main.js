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

let currentActiveLink = null;

function initNavigation() {
  console.log('Course App: Initializing navigation...');
  if (!navElement) {
    console.error('Course App: Navigation element #course-nav not found!');
    return;
  }

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
        console.log('Course App: Auto-loading first lesson:', lesson.id);
        loadLesson(lesson, link);
      }
    });

    navElement.appendChild(group);
  });
  console.log('Course App: Navigation initialized.');
}

async function loadLesson(lesson, linkElement) {
  console.log('Course App: Requesting lesson:', lesson.file);

  if (currentActiveLink) currentActiveLink.classList.remove('active');
  linkElement.classList.add('active');
  currentActiveLink = linkElement;

  contentElement.classList.remove('fade-in');
  contentElement.innerHTML = '<p class="loader">Loading lesson...</p>';
  headerElement.innerHTML = `<h1>${lesson.title}</h1>`;

  try {
    const response = await fetch(lesson.file);
    if (!response.ok) {
      console.error('Course App: Fetch error!', response.status, lesson.file);
      throw new Error(`Lesson file not found (${response.status})`);
    }

    const text = await response.text();
    console.log('Course App: Lesson content received.');

    const cleanText = text.replace(/^# .*\n/, '');
    contentElement.innerHTML = marked.parse(cleanText);
    contentElement.classList.add('fade-in');

    const mainContent = document.getElementById('main-content');
    if (mainContent) mainContent.scrollTop = 0;

  } catch (error) {
    console.error('Course App: Critical error loading lesson:', error);
    contentElement.innerHTML = `
      <div class="error-box">
        <h3>Error Loading Lesson</h3>
        <p>${error.message}</p>
        <code style="display:block; margin-top:10px; background:#222; padding:10px; border-radius:4px;">
          Tested path: ${lesson.file}
        </code>
      </div>`;
  }
}

initNavigation();
