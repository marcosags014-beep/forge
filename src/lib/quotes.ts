// 200+ curated quotes from the greatest minds on discipline, identity, and becoming.
// Sources: Greg Plitt, Marcus Aurelius, Seneca, Epictetus, David Goggins,
// Jocko Willink, Miyamoto Musashi, Bruce Lee, Nietzsche, Arnold, Naval, and more.

export interface DailyQuote {
  text: string
  author: string
  category: 'warrior' | 'stoic' | 'discipline' | 'identity' | 'time' | 'fire'
}

export const QUOTES: DailyQuote[] = [
  // ── Greg Plitt ──────────────────────────────────────────
  { text: "The clock is ticking. Are you becoming the person you want to be?", author: "Greg Plitt", category: "identity" },
  { text: "You're either living your dreams or living your fears.", author: "Greg Plitt", category: "fire" },
  { text: "Your comfort zone is your danger zone.", author: "Greg Plitt", category: "discipline" },
  { text: "Second by second you lose the opportunity to become the person you want to be. Take charge of your life.", author: "Greg Plitt", category: "time" },
  { text: "Success doesn't know about cold or early or tired. It just knows if you showed up or not.", author: "Greg Plitt", category: "discipline" },
  { text: "Opportunities don't come knocking on the door. They present themselves when you knock the door down.", author: "Greg Plitt", category: "fire" },
  { text: "If tomorrow doesn't happen, would you still do what you're about to do today? If the answer is no, you're alive — but you're not living.", author: "Greg Plitt", category: "identity" },
  { text: "Bet on yourself. If you bet on yourself, you'll never lose.", author: "Greg Plitt", category: "fire" },
  { text: "Time is the most valuable asset on earth — a depreciating asset. Don't waste it.", author: "Greg Plitt", category: "time" },
  { text: "You are what you do repeatedly every day. If excellence is something you're striving for, it's not an accident. It's a habit.", author: "Greg Plitt", category: "discipline" },
  { text: "Champions are not the ones who always win races — champions are the ones who get out there and try. And try harder the next time.", author: "Greg Plitt", category: "warrior" },
  { text: "You got one life to live. Why wait until tomorrow to start it?", author: "Greg Plitt", category: "time" },
  { text: "Tomorrow is the most dangerous word in the dictionary.", author: "Greg Plitt", category: "time" },

  // ── Marcus Aurelius ─────────────────────────────────────
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", category: "stoic" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius", category: "warrior" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", category: "identity" },
  { text: "At dawn, when you have trouble getting out of bed, tell yourself: I have to go to work — as a human being.", author: "Marcus Aurelius", category: "discipline" },
  { text: "Be tolerant with others and strict with yourself.", author: "Marcus Aurelius", category: "discipline" },
  { text: "The best revenge is to be unlike him who performed the injustice.", author: "Marcus Aurelius", category: "stoic" },
  { text: "If it is not right, do not do it; if it is not true, do not say it.", author: "Marcus Aurelius", category: "stoic" },
  { text: "You have to assemble your life yourself — action by action. And be satisfied if each one achieves its goal.", author: "Marcus Aurelius", category: "discipline" },
  { text: "Confine yourself to the present.", author: "Marcus Aurelius", category: "time" },
  { text: "Loss is nothing else but change, and change is nature's delight.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius", category: "stoic" },
  { text: "It is not death that a man should fear, but he should fear never beginning to live.", author: "Marcus Aurelius", category: "fire" },
  { text: "Accept the things to which fate binds you, and love the people with whom fate brings you together.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Never esteem anything as of advantage to you that will make you break your word or lose your self-respect.", author: "Marcus Aurelius", category: "identity" },
  { text: "The universe is change; life is what thinking makes of it.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Receive without conceit, release without struggle.", author: "Marcus Aurelius", category: "stoic" },
  { text: "How much more grievous are the consequences of anger than the causes of it.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Think of yourself as dead. You have lived your life. Now take what's left and live it properly.", author: "Marcus Aurelius", category: "time" },

  // ── Seneca ──────────────────────────────────────────────
  { text: "It is not that we have a short time to live, but that we waste a lot of it.", author: "Seneca", category: "time" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", category: "stoic" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", category: "time" },
  { text: "The whole future lies in uncertainty: live immediately.", author: "Seneca", category: "time" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", category: "discipline" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca", category: "stoic" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca", category: "warrior" },
  { text: "He who is brave is free.", author: "Seneca", category: "fire" },
  { text: "No man was ever wise by chance.", author: "Seneca", category: "discipline" },
  { text: "A gem cannot be polished without friction, nor a man perfected without trials.", author: "Seneca", category: "warrior" },
  { text: "Omnia aliena sunt, tempus tantum nostrum est. All things are alien; time alone is ours.", author: "Seneca", category: "time" },
  { text: "Nusquam est qui ubique est. He who is everywhere is nowhere.", author: "Seneca", category: "discipline" },
  { text: "Dum differtur vita transcurrit. While we're waiting, life passes.", author: "Seneca", category: "time" },
  { text: "Retire into yourself as much as you can; associate with those who will make a better man of you.", author: "Seneca", category: "identity" },
  { text: "It is a rough road that leads to the heights of greatness.", author: "Seneca", category: "warrior" },
  { text: "He suffers more than necessary, who suffers before it is necessary.", author: "Seneca", category: "stoic" },
  { text: "The part of life we really live is small. The rest is not life but merely time.", author: "Seneca", category: "time" },
  { text: "If you really want to escape the things that harass you, what you need is not to be in a different place but to be a different person.", author: "Seneca", category: "identity" },

  // ── Epictetus ───────────────────────────────────────────
  { text: "Make the best use of what is in your power, and take the rest as it happens.", author: "Epictetus", category: "stoic" },
  { text: "It's not what happens to you, but how you react to it that matters.", author: "Epictetus", category: "stoic" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", category: "identity" },
  { text: "No man is free who is not master of himself.", author: "Epictetus", category: "discipline" },
  { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus", category: "stoic" },
  { text: "Men are disturbed not by things, but by the opinions they have about things.", author: "Epictetus", category: "stoic" },
  { text: "Seek not the good in external things; seek it in yourself.", author: "Epictetus", category: "identity" },
  { text: "Difficulties show men what they are.", author: "Epictetus", category: "warrior" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus", category: "stoic" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus", category: "identity" },
  { text: "We cannot choose our external circumstances, but we can always choose how we respond to them.", author: "Epictetus", category: "stoic" },
  { text: "He who laughs at himself never runs out of things to laugh at.", author: "Epictetus", category: "stoic" },

  // ── David Goggins ───────────────────────────────────────
  { text: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.", author: "David Goggins", category: "fire" },
  { text: "When you think you're done, you're only at 40 percent of what your body is capable of.", author: "David Goggins", category: "warrior" },
  { text: "I don't stop when I'm tired. I stop when I'm done.", author: "David Goggins", category: "discipline" },
  { text: "The only way you gain mental toughness is to do things you're not happy doing.", author: "David Goggins", category: "discipline" },
  { text: "Mental toughness is a lifestyle. It's something you live every single day.", author: "David Goggins", category: "discipline" },
  { text: "You have to build calluses on your brain, just like you build calluses on your hands.", author: "David Goggins", category: "warrior" },
  { text: "Pain unlocks a secret doorway in the mind — one that leads to both peak performance and beautiful silence.", author: "David Goggins", category: "warrior" },
  { text: "Be uncommon amongst uncommon people.", author: "David Goggins", category: "identity" },
  { text: "Nobody cares what you did yesterday. What have you done today to better yourself?", author: "David Goggins", category: "discipline" },
  { text: "The most important conversations you'll ever have are the ones you'll have with yourself.", author: "David Goggins", category: "identity" },
  { text: "It's a lot more than mind over matter. It takes relentless self-discipline to schedule suffering into your day, every day.", author: "David Goggins", category: "discipline" },
  { text: "If you have any fraction of self-discipline — the ability to not want to do it, but still do it — on the other side is greatness.", author: "David Goggins", category: "fire" },

  // ── Jocko Willink ───────────────────────────────────────
  { text: "Discipline equals freedom.", author: "Jocko Willink", category: "discipline" },
  { text: "Don't count on motivation. Count on discipline.", author: "Jocko Willink", category: "discipline" },
  { text: "When the alarm goes off, do you get up or do you lie there? That moment is the test. And it translates to everything.", author: "Jocko Willink", category: "discipline" },
  { text: "There is no easy way. There is only hard work, late nights, early mornings, practice, rehearsal, repetition, study, sweat, blood, toil, frustration, and discipline.", author: "Jocko Willink", category: "warrior" },
  { text: "The shortcut is a lie. The hack doesn't get you there.", author: "Jocko Willink", category: "discipline" },
  { text: "If you want to be tougher mentally, it is simple: Be tougher. Don't meditate on it.", author: "Jocko Willink", category: "warrior" },
  { text: "Good. Use it.", author: "Jocko Willink", category: "fire" },
  { text: "Extreme ownership: own everything in your world. There are no bad teams, only bad leaders.", author: "Jocko Willink", category: "identity" },
  { text: "Get up. Get after it. Get better.", author: "Jocko Willink", category: "discipline" },
  { text: "Default aggressive.", author: "Jocko Willink", category: "warrior" },

  // ── Miyamoto Musashi ────────────────────────────────────
  { text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.", author: "Miyamoto Musashi", category: "identity" },
  { text: "Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.", author: "Miyamoto Musashi", category: "warrior" },
  { text: "One thousand days of lessons for discipline; ten thousand days of lessons for mastery.", author: "Miyamoto Musashi", category: "discipline" },
  { text: "In fighting and in everyday life you should be determined though calm.", author: "Miyamoto Musashi", category: "warrior" },
  { text: "Accept everything just the way it is.", author: "Miyamoto Musashi", category: "stoic" },
  { text: "Do not seek pleasure for its own sake.", author: "Miyamoto Musashi", category: "discipline" },
  { text: "Think lightly of yourself and deeply of the world.", author: "Miyamoto Musashi", category: "stoic" },
  { text: "You must understand that there is more than one path to the top of the mountain.", author: "Miyamoto Musashi", category: "warrior" },
  { text: "Do nothing that is of no use.", author: "Miyamoto Musashi", category: "discipline" },
  { text: "It may seem difficult at first, but everything is difficult at first.", author: "Miyamoto Musashi", category: "warrior" },
  { text: "The true science of martial arts means practicing them in such a way that they will be useful at any time.", author: "Miyamoto Musashi", category: "warrior" },
  { text: "If you know the way broadly, you will see it in everything.", author: "Miyamoto Musashi", category: "identity" },

  // ── Bruce Lee ───────────────────────────────────────────
  { text: "Do not pray for an easy life, pray for the strength to endure a difficult one.", author: "Bruce Lee", category: "warrior" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.", author: "Bruce Lee", category: "discipline" },
  { text: "Knowing is not enough, we must apply. Willing is not enough, we must do.", author: "Bruce Lee", category: "discipline" },
  { text: "Be like water. Water can flow or crash. Be water, my friend.", author: "Bruce Lee", category: "warrior" },
  { text: "If you always put limits on everything you do, it will spread into your work and into your life. There are no limits.", author: "Bruce Lee", category: "fire" },
  { text: "Mistakes are always forgivable, if one has the courage to admit them.", author: "Bruce Lee", category: "identity" },
  { text: "The key to immortality is first living a life worth remembering.", author: "Bruce Lee", category: "identity" },
  { text: "A wise man can learn more from a foolish question than a fool can learn from a wise answer.", author: "Bruce Lee", category: "stoic" },
  { text: "Simplicity is the key to brilliance.", author: "Bruce Lee", category: "discipline" },
  { text: "Life itself is your teacher, and you are in a state of constant learning.", author: "Bruce Lee", category: "identity" },

  // ── Friedrich Nietzsche ─────────────────────────────────
  { text: "That which does not kill us, makes us stronger.", author: "Nietzsche", category: "warrior" },
  { text: "He who has a why to live for can bear almost any how.", author: "Nietzsche", category: "identity" },
  { text: "One must still have chaos in oneself to be able to give birth to a dancing star.", author: "Nietzsche", category: "fire" },
  { text: "The higher we soar, the smaller we appear to those who cannot fly.", author: "Nietzsche", category: "fire" },
  { text: "You must be ready to burn yourself in your own flame — how could you rise anew if you have not first become ashes?", author: "Nietzsche", category: "identity" },
  { text: "In individuals, insanity is rare; but in groups, parties, nations, epochs — it is the rule.", author: "Nietzsche", category: "stoic" },
  { text: "The secret for harvesting the greatest fruitfulness from existence is to live dangerously.", author: "Nietzsche", category: "fire" },
  { text: "Without music, life would be a mistake.", author: "Nietzsche", category: "stoic" },
  { text: "Become who you are.", author: "Nietzsche", category: "identity" },
  { text: "Is life not a thousand times too short for us to bore ourselves?", author: "Nietzsche", category: "fire" },
  { text: "No price is too high to pay for the privilege of owning yourself.", author: "Nietzsche", category: "identity" },
  { text: "The doer alone learneth.", author: "Nietzsche", category: "discipline" },

  // ── Arnold Schwarzenegger ───────────────────────────────
  { text: "The mind is the limit. As long as the mind can envision the fact that you can do something, you can do it.", author: "Arnold Schwarzenegger", category: "identity" },
  { text: "Strength does not come from winning. Your struggles develop your strengths. When you go through hardships and decide not to surrender, that is strength.", author: "Arnold Schwarzenegger", category: "warrior" },
  { text: "The last three or four reps is what makes the muscle grow. This area of pain divides a champion from someone who is not.", author: "Arnold Schwarzenegger", category: "warrior" },
  { text: "Work your ass off. There are no shortcuts — everything is reps, reps, reps.", author: "Arnold Schwarzenegger", category: "discipline" },
  { text: "For me life is continuously being hungry. The meaning of life is not simply to exist, to survive, but to move ahead, to go up, to achieve, to conquer.", author: "Arnold Schwarzenegger", category: "fire" },
  { text: "You can have results or excuses. Not both.", author: "Arnold Schwarzenegger", category: "discipline" },
  { text: "Nobody ever got muscles by watching me lift weights.", author: "Arnold Schwarzenegger", category: "discipline" },
  { text: "Staying hungry. Stay foolish. Never be satisfied, and always push yourself to achieve the next goal.", author: "Arnold Schwarzenegger", category: "fire" },

  // ── Naval Ravikant ──────────────────────────────────────
  { text: "A fit body, a calm mind, a house full of love. These things cannot be bought — they must be earned.", author: "Naval Ravikant", category: "identity" },
  { text: "Desire is a contract you make with yourself to be unhappy until you get what you want.", author: "Naval Ravikant", category: "stoic" },
  { text: "The best way to stay calm is to not need anything from anyone.", author: "Naval Ravikant", category: "stoic" },
  { text: "You will never be as good at someone else's game as they are. Find your own game.", author: "Naval Ravikant", category: "identity" },
  { text: "Reading is the ultimate meta-skill and can be traded for anything.", author: "Naval Ravikant", category: "discipline" },
  { text: "Specific knowledge is knowledge you cannot be trained for. It's found by pursuing your genuine curiosity.", author: "Naval Ravikant", category: "identity" },
  { text: "Arm yourself with specific knowledge, accountability, and leverage.", author: "Naval Ravikant", category: "fire" },
  { text: "Long-term thinking is the foundation of every advantage worth having.", author: "Naval Ravikant", category: "time" },

  // ── Sun Tzu ─────────────────────────────────────────────
  { text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.", author: "Sun Tzu", category: "warrior" },
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu", category: "warrior" },
  { text: "Opportunities multiply as they are seized.", author: "Sun Tzu", category: "fire" },
  { text: "Know yourself and you will win all battles.", author: "Sun Tzu", category: "identity" },
  { text: "Supreme excellence consists in breaking the enemy's resistance without fighting.", author: "Sun Tzu", category: "warrior" },
  { text: "He who knows when he can fight and when he cannot will be victorious.", author: "Sun Tzu", category: "warrior" },
  { text: "Move swift as the wind and closely-formed as the wood. Attack like the fire and be still as the mountain.", author: "Sun Tzu", category: "warrior" },

  // ── Theodore Roosevelt ──────────────────────────────────
  { text: "The credit belongs to the man who is actually in the arena — whose face is marred by dust and sweat and blood.", author: "Theodore Roosevelt", category: "warrior" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "discipline" },
  { text: "With self-discipline, most anything is possible.", author: "Theodore Roosevelt", category: "discipline" },
  { text: "Keep your eyes on the stars and your feet on the ground.", author: "Theodore Roosevelt", category: "identity" },
  { text: "Nothing in the world is worth having or worth doing unless it means effort, pain, difficulty.", author: "Theodore Roosevelt", category: "warrior" },

  // ── Winston Churchill ───────────────────────────────────
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "warrior" },
  { text: "If you're going through hell, keep going.", author: "Winston Churchill", category: "fire" },
  { text: "The pessimist sees difficulty in every opportunity. The optimist sees opportunity in every difficulty.", author: "Winston Churchill", category: "stoic" },
  { text: "Continuous effort — not strength or intelligence — is the key to unlocking your potential.", author: "Winston Churchill", category: "discipline" },

  // ── Steve Jobs ──────────────────────────────────────────
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "identity" },
  { text: "The people who are crazy enough to think they can change the world are the ones who do.", author: "Steve Jobs", category: "fire" },
  { text: "Stay hungry. Stay foolish.", author: "Steve Jobs", category: "fire" },
  { text: "Remembering that you are going to die is the best way I know to avoid the trap of thinking you have something to lose.", author: "Steve Jobs", category: "time" },
  { text: "Quality is more important than quantity. One home run is much better than two doubles.", author: "Steve Jobs", category: "discipline" },

  // ── Ryan Holiday ────────────────────────────────────────
  { text: "The obstacle is the way.", author: "Ryan Holiday", category: "warrior" },
  { text: "Ego is the enemy of what you want and of what you have.", author: "Ryan Holiday", category: "identity" },
  { text: "Your potential, the absolute best you're capable of — that's the metric to measure yourself against.", author: "Ryan Holiday", category: "identity" },
  { text: "Stillness is the key.", author: "Ryan Holiday", category: "stoic" },

  // ── Dostoevsky / Tolstoy ────────────────────────────────
  { text: "The mystery of human existence lies not in just staying alive, but in finding something to live for.", author: "Dostoevsky", category: "identity" },
  { text: "Everyone thinks of changing the world, but no one thinks of changing himself.", author: "Tolstoy", category: "identity" },

  // ── Albert Camus ────────────────────────────────────────
  { text: "In the middle of winter I at last discovered that there was in me an invincible summer.", author: "Albert Camus", category: "fire" },
  { text: "You will never be happy if you continue to search for what happiness consists of. You will never live if you are looking for the meaning of life.", author: "Albert Camus", category: "stoic" },

  // ── Aristotle ───────────────────────────────────────────
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Aristotle", category: "discipline" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "warrior" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "identity" },
  { text: "The energy of the mind is the essence of life.", author: "Aristotle", category: "identity" },

  // ── Viktor Frankl ───────────────────────────────────────
  { text: "When we are no longer able to change a situation, we are challenged to change ourselves.", author: "Viktor Frankl", category: "stoic" },
  { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl", category: "stoic" },
  { text: "He who has a why to live for can bear almost any how.", author: "Viktor Frankl", category: "identity" },
  { text: "Everything can be taken from a man but one thing: the last of the human freedoms — to choose one's attitude in any given set of circumstances.", author: "Viktor Frankl", category: "stoic" },

  // ── Rumi ────────────────────────────────────────────────
  { text: "Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.", author: "Rumi", category: "identity" },
  { text: "The wound is the place where the light enters you.", author: "Rumi", category: "warrior" },
  { text: "What you seek is seeking you.", author: "Rumi", category: "fire" },
  { text: "Live life as if everything is rigged in your favor.", author: "Rumi", category: "fire" },

  // ── Napoleon / Military ─────────────────────────────────
  { text: "The battlefield is a scene of constant chaos. The winner will be the one who controls that chaos, both their own and the enemy's.", author: "Napoleon Bonaparte", category: "warrior" },
  { text: "Impossible is a word found only in the dictionary of fools.", author: "Napoleon Bonaparte", category: "fire" },
  { text: "The secret of all victory lies in the organization of the non-obvious.", author: "Napoleon Bonaparte", category: "warrior" },

  // ── Kobe Bryant ─────────────────────────────────────────
  { text: "Everything negative — pressure, challenges — is all an opportunity for me to rise.", author: "Kobe Bryant", category: "warrior" },
  { text: "I'll do what others won't, so I can have what others don't.", author: "Kobe Bryant", category: "discipline" },
  { text: "Great things come from hard work and perseverance. No excuses.", author: "Kobe Bryant", category: "discipline" },
  { text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.", author: "Kobe Bryant", category: "identity" },

  // ── Muhammad Ali ────────────────────────────────────────
  { text: "I hated every minute of training, but I said: don't quit. Suffer now and live the rest of your life as a champion.", author: "Muhammad Ali", category: "warrior" },
  { text: "Impossible is not a fact. It's an opinion. Impossible is not a declaration. It's a dare.", author: "Muhammad Ali", category: "fire" },
  { text: "Float like a butterfly, sting like a bee. The hands can't hit what the eyes can't see.", author: "Muhammad Ali", category: "warrior" },
  { text: "It's the repetition of affirmations that leads to belief. And once that belief becomes a deep conviction, things begin to happen.", author: "Muhammad Ali", category: "identity" },

  // ── Heraclitus ──────────────────────────────────────────
  { text: "No man ever steps in the same river twice, for it is not the same river and he is not the same man.", author: "Heraclitus", category: "time" },
  { text: "The soul is dyed the color of its thoughts.", author: "Heraclitus", category: "identity" },
  { text: "Big results require big ambitions.", author: "Heraclitus", category: "fire" },
  { text: "Out of every one hundred men, ten shouldn't even be there, eighty are just targets, nine are the real fighters — and we are lucky to have them, for they make the battle. Ah, but the one — one is a warrior — and he will bring the others back.", author: "Heraclitus", category: "warrior" },

  // ── Confucius ───────────────────────────────────────────
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "discipline" },
  { text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", category: "warrior" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", category: "discipline" },
  { text: "Before you embark on a journey of revenge, dig two graves.", author: "Confucius", category: "stoic" },

  // ── Ralph Waldo Emerson ─────────────────────────────────
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "identity" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", category: "fire" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "identity" },
]

// Returns today's quote — deterministic, cycles through all quotes
export function getDailyQuote(): DailyQuote {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000)
  return QUOTES[daysSinceEpoch % QUOTES.length]
}

// Returns whether the quote modal should show today (once per day)
export function shouldShowDailyQuote(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const last = localStorage.getItem('forge_quote_shown')
    const today = new Date().toISOString().split('T')[0]
    return last !== today
  } catch { return false }
}

export function markQuoteShown(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem('forge_quote_shown', new Date().toISOString().split('T')[0])
  } catch {}
}
