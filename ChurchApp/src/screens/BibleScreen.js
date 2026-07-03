import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Modal, TextInput,
  FlatList, Alert, ActivityIndicator, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bibleBooks, fetchEnglishChapter, fetchTeluguChapter } from '../data/bibleData';
import { bibleVersions, highlightColors } from '../data/mockData';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useApp } from '../context/AppContext';

const ALL_BOOKS = [...bibleBooks.OT, ...bibleBooks.NT];

const STEP_BOOK = 'BOOK';
const STEP_CHAPTER = 'CHAPTER';
const STEP_VERSE = 'VERSE';

export default function BibleScreen({ navigation, route }) {
  const { saveProgress } = useReadingProgress();
  const {
    colors, isDarkMode, theme, setTheme,
    isBookmarked, toggleBookmark,
    highlights, toggleHighlight,
    notes, addNote,
    fontSize, setFontSize,
    bibleVersion, setBibleVersion,
    bibleLanguage, setBibleLanguage,
    currentBibleBook, setCurrentBibleBook,
    currentChapter, setCurrentChapter,
  } = useApp();

  const lastAppliedParams = useRef('');
  useEffect(() => {
    const params = route?.params;
    if (!params?.book && !params?.chapter) return;

    const nextKey = `${params.book || ''}-${params.chapter || ''}-${params.verseId || ''}`;
    if (lastAppliedParams.current === nextKey) return;
    lastAppliedParams.current = nextKey;

    if (params.book) setCurrentBibleBook(params.book);
    if (params.chapter) setCurrentChapter(Number(params.chapter));
    if (params.verseId) {
      setSelectedVerse(params.verseId);
      setShowActionBar(true);
    }
  }, [route?.params]);

  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showActionBar, setShowActionBar] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showParallelMode, setShowParallelMode] = useState(false);
  const [parallelVerses, setParallelVerses] = useState([]);

  const [showNavigator, setShowNavigator] = useState(false);
  const [navStep, setNavStep] = useState(STEP_BOOK);
  const [navTestament, setNavTestament] = useState('NT');
  const [pickedBook, setPickedBook] = useState(null);
  const [pickedChapter, setPickedChapter] = useState(null);

  const [showVersionPicker, setShowVersionPicker] = useState(false);
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);

  const styles = makeStyles(colors, fontSize);
  const scrollRef = useRef(null);

  const isTelugu = bibleLanguage === 'telugu';
  const getBookLabel = useCallback(
    (bookName) => {
      const book = ALL_BOOKS.find((b) => b.name === bookName || b.id === bookName);
      if (!book) return bookName;
      return isTelugu ? (book.teluguName || book.name) : book.name;
    },
    [isTelugu],
  );
  const currentBookLabel = getBookLabel(currentBibleBook);
  const getBookTestament = (bookName) => (
    bibleBooks.OT.some((b) => b.name === bookName || b.id === bookName) ? 'OT' : 'NT'
  );

  const currentBookData = ALL_BOOKS.find(
    (b) => b.name === currentBibleBook || b.id === currentBibleBook,
  );
  const maxChapters = currentBookData?.chapters || 1;

  const loadChapter = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelectedVerse(null);
    setShowActionBar(false);
    setShowHighlightPicker(false);
    try {
      let data;
      if (bibleLanguage === 'telugu') {
        data = await fetchTeluguChapter(currentBibleBook, currentChapter);
      } else {
        data = await fetchEnglishChapter(currentBibleBook, currentChapter, bibleVersion);
      }
      setVerses(data);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (e) {
      setError(e.message || 'Failed to load. Check your connection.');
      setVerses([]);
    } finally {
      setLoading(false);
    }
  }, [currentBibleBook, currentChapter, bibleVersion, bibleLanguage]);

  const loadParallel = useCallback(async () => {
    if (!showParallelMode) return;
    try {
      let data;
      if (bibleLanguage === 'telugu') {
        data = await fetchEnglishChapter(currentBibleBook, currentChapter, bibleVersion);
      } else {
        data = await fetchTeluguChapter(currentBibleBook, currentChapter);
      }
      setParallelVerses(data);
    } catch {
      setParallelVerses([]);
    }
  }, [showParallelMode, currentBibleBook, currentChapter, bibleVersion, bibleLanguage]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  useEffect(() => {
    saveProgress({
      book: currentBibleBook,
      chapter: currentChapter,
      verse: 1,
      version: bibleLanguage === 'telugu' ? 'Telugu' : bibleVersion,
    });
  }, [currentBibleBook, currentChapter, bibleLanguage, bibleVersion, saveProgress]);

  useEffect(() => {
    loadParallel();
  }, [loadParallel]);

  const openNavigator = () => {
    setNavTestament(getBookTestament(currentBibleBook));
    setPickedBook(null);
    setPickedChapter(null);
    setNavStep(STEP_BOOK);
    setShowNavigator(true);
  };

  const handlePickBook = (book) => {
    setPickedBook(book);
    setNavStep(STEP_CHAPTER);
  };

  const handlePickChapter = (chNum) => {
    setPickedChapter(chNum);
    setNavStep(STEP_VERSE);
  };

  const handlePickVerse = (verse) => {
    setCurrentBibleBook(pickedBook.name);
    setCurrentChapter(pickedChapter);
    setShowNavigator(false);
    setSelectedVerse(verse.id);
    setShowActionBar(true);
  };

  const navGoBack = () => {
    if (navStep === STEP_VERSE) {
      setNavStep(STEP_CHAPTER);
      setPickedChapter(null);
    } else if (navStep === STEP_CHAPTER) {
      setNavStep(STEP_BOOK);
      setPickedBook(null);
    } else {
      setShowNavigator(false);
    }
  };

  const handleVersePress = (verseId) => {
    if (selectedVerse === verseId) {
      setSelectedVerse(null);
      setShowActionBar(false);
    } else {
      setSelectedVerse(verseId);
      setShowActionBar(true);
    }
  };

  const handleBookmark = () => {
    if (!selectedVerse) return;
    const verse = verses.find((v) => v.id === selectedVerse);
    if (!verse) return;
    toggleBookmark({
      id: selectedVerse,
      type: 'verse',
      title: `${currentBookLabel} ${currentChapter}:${verse.number}`,
      reference: `${currentBookLabel} ${currentChapter}:${verse.number}`,
      text: verse.text,
      book: currentBibleBook,
      chapter: currentChapter,
      verseNum: verse.number,
      language: bibleLanguage,
      version: bibleVersion,
    });
  };

  const handleHighlight = (colorId) => {
    if (selectedVerse) {
      toggleHighlight(selectedVerse, colorId);
      setShowHighlightPicker(false);
    }
  };

  const handleNote = () => {
    const existingNote = notes[selectedVerse];
    setNoteText(typeof existingNote === 'string' ? existingNote : existingNote?.note || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    if (selectedVerse) {
      const verse = verses.find((v) => v.id === selectedVerse);
      addNote(selectedVerse, noteText, {
        reference: verse ? `${currentBookLabel} ${currentChapter}:${verse.number}` : selectedVerse,
        text: verse?.text || '',
        book: currentBibleBook,
        chapter: currentChapter,
        verseNum: verse?.number || '',
        language: bibleLanguage,
        version: bibleVersion,
      });
    }
    setShowNoteModal(false);
  };

  const handleShare = async () => {
    const verse = verses.find((v) => v.id === selectedVerse);
    if (!verse) return;
    await Share.share({
      message: `"${verse.text}" — ${currentBibleBook} ${currentChapter}:${verse.number}`,
    }).catch(() => {});
  };

  const getVerseBackground = (verse) => {
    if (highlights[verse.id]) {
      const hc = highlightColors.find((h) => h.id === highlights[verse.id]);
      return hc ? hc.color + '33' : colors.verseHighlight;
    }
    if (selectedVerse === verse.id) return colors.overlay;
    return 'transparent';
  };

  const changeChapter = (dir) => {
    const next = currentChapter + dir;
    if (next < 1 || next > maxChapters) return;
    setCurrentChapter(next);
  };

  const versionLabel = isTelugu ? 'తెలుగు' : bibleVersion;

  const renderNavHeader = () => {
    return (
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={navGoBack} style={styles.navBackBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.breadcrumb}>
          <TouchableOpacity
            onPress={() => {
              setNavStep(STEP_BOOK);
              setPickedBook(null);
              setPickedChapter(null);
            }}
          >
            <Text style={[styles.crumb, navStep === STEP_BOOK && styles.crumbActive]}>
              {pickedBook ? (isTelugu ? pickedBook.teluguName : pickedBook.name) : (isTelugu ? 'గ్రంథము' : 'Book')}
            </Text>
          </TouchableOpacity>
          {pickedBook && (
            <>
              <Ionicons name="chevron-forward" size={12} color={colors.textLight} />
              <TouchableOpacity onPress={() => { setNavStep(STEP_CHAPTER); setPickedChapter(null); }}>
                <Text style={[styles.crumb, navStep === STEP_CHAPTER && styles.crumbActive]}>
                  {pickedChapter ? (isTelugu ? `అధ్యా. ${pickedChapter}` : `Ch ${pickedChapter}`) : (isTelugu ? 'అధ్యాయం' : 'Chapter')}
                </Text>
              </TouchableOpacity>
            </>
          )}
          {pickedChapter && (
            <>
              <Ionicons name="chevron-forward" size={12} color={colors.textLight} />
              <Text style={[styles.crumb, styles.crumbActive]}>{isTelugu ? 'వచనం' : 'Verse'}</Text>
            </>
          )}
        </View>
        <TouchableOpacity onPress={() => setShowNavigator(false)} style={styles.navCloseBtn}>
          <Ionicons name="close" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderStepBook = () => (
    <>
      <View style={styles.modalTabRow}>
        {['OT', 'NT'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.modalTab, navTestament === t && styles.modalActiveTab]}
            onPress={() => setNavTestament(t)}
          >
            <Text style={[styles.modalTabText, navTestament === t && styles.modalActiveTabText]}>
              {isTelugu ? (t === 'OT' ? 'పాత నిబంధన' : 'క్రొత్త నిబంధన') : (t === 'OT' ? 'Old Testament' : 'New Testament')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={bibleBooks[navTestament]}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isActive = currentBibleBook === item.name;
          return (
            <TouchableOpacity
              style={[styles.bookItem, isActive && styles.bookItemActive]}
              onPress={() => handlePickBook(item)}
              activeOpacity={0.75}
            >
              <Text style={[styles.bookItemText, isActive && styles.bookItemActiveText]} numberOfLines={2}>
                {isTelugu ? item.teluguName : item.name}
              </Text>
              <Text style={[styles.bookItemSub, isActive && { color: '#fff' }]}>
                {item.chapters} {isTelugu ? 'అధ్యా.' : 'ch'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );

  const renderStepChapter = () => {
    const totalCh = pickedBook?.chapters || 1;
    const chapters = Array.from({ length: totalCh }, (_, i) => i + 1);
    return (
      <FlatList
        data={chapters}
        keyExtractor={(item) => String(item)}
        numColumns={5}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const isActive = currentBibleBook === pickedBook?.name && currentChapter === item;
          return (
            <TouchableOpacity
              style={[styles.chapterItem, isActive && styles.chapterItemActive]}
              onPress={() => handlePickChapter(item)}
              activeOpacity={0.75}
            >
              <Text style={[styles.chapterItemText, isActive && styles.chapterItemActiveText]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    );
  };

  const NavVerseList = () => {
    const [navVerses, setNavVerses] = useState([]);
    const [navLoading, setNavLoading] = useState(true);
    const [navError, setNavError] = useState(null);

    useEffect(() => {
      let cancelled = false;
      (async () => {
        setNavLoading(true);
        setNavError(null);
        try {
          let data;
          if (isTelugu) {
            data = await fetchTeluguChapter(pickedBook.name, pickedChapter);
          } else {
            data = await fetchEnglishChapter(pickedBook.name, pickedChapter, bibleVersion);
          }
          if (!cancelled) setNavVerses(data);
        } catch (e) {
          if (!cancelled) setNavError(e.message || 'Failed to load');
        } finally {
          if (!cancelled) setNavLoading(false);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, []);

    if (navLoading)
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    if (navError)
      return (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={40} color={colors.textLight} />
          <Text style={styles.errorText}>{navError}</Text>
        </View>
      );
    return (
      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {navVerses.map((verse) => (
          <TouchableOpacity
            key={verse.id}
            style={styles.navVerseRow}
            onPress={() => handlePickVerse(verse)}
            activeOpacity={0.75}
          >
            <View style={styles.navVerseNumWrap}>
              <Text style={styles.navVerseNum}>{verse.number}</Text>
            </View>
            <Text style={styles.navVerseText} numberOfLines={3}>
              {verse.text}
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textLight} style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  const THEMES = [
    { id: 'light', label: 'Light', icon: 'sunny-outline' },
    { id: 'sepia', label: 'Eye Protection', icon: 'leaf-outline' },
    { id: 'dark', label: 'Dark', icon: 'moon-outline' },
  ];

  const FONT_SIZES = [
    { label: 'S', size: 14 },
    { label: 'M', size: 16 },
    { label: 'L', size: 19 },
    { label: 'XL', size: 22 },
  ];

  const renderDisplaySettings = () => (
    <Modal visible={showDisplaySettings} transparent animationType="fade">
      <TouchableOpacity
        style={styles.displayOverlay}
        activeOpacity={1}
        onPress={() => setShowDisplaySettings(false)}
      >
        <TouchableOpacity activeOpacity={1} style={[styles.displayPanel, { backgroundColor: colors.surface }]}>
          <Text style={styles.displaySectionLabel}>Font Size</Text>
          <View style={styles.fontSizeRow}>
            {FONT_SIZES.map((fs) => (
              <TouchableOpacity
                key={fs.label}
                style={[
                  styles.fontSizeBtn,
                  { borderColor: colors.border, backgroundColor: colors.surfaceSecondary },
                  fontSize === fs.size && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => setFontSize(fs.size)}
              >
                <Text
                  style={[
                    styles.fontSizeBtnText,
                    { fontSize: fs.size - 2, color: colors.textSecondary },
                    fontSize === fs.size && { color: '#fff', fontWeight: '700' },
                  ]}
                >
                  {fs.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.fontSliderRow}>
            <TouchableOpacity
              style={[styles.fontAdjBtn, { backgroundColor: colors.surfaceSecondary }]}
              onPress={() => setFontSize((f) => Math.max(12, f - 1))}
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.fontSliderValue, { color: colors.primary }]}>{fontSize}px</Text>
            <TouchableOpacity
              style={[styles.fontAdjBtn, { backgroundColor: colors.surfaceSecondary }]}
              onPress={() => setFontSize((f) => Math.min(28, f + 1))}
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.displayDivider, { backgroundColor: colors.border }]} />

          <Text style={styles.displaySectionLabel}>Theme</Text>
          <View style={styles.themeRow}>
            {THEMES.map((t) => (
              <TouchableOpacity
                key={t.id}
                style={[styles.themeBtn, { borderColor: colors.border }, theme === t.id && { borderColor: colors.primary, borderWidth: 2.5 }]}
                onPress={() => setTheme(t.id)}
              >
                <Ionicons name={t.icon} size={20} color={colors.text} />
                <Text style={[styles.themeBtnLabel, { color: colors.text }]}>{t.label}</Text>
                {theme === t.id && (
                  <View style={[styles.themeCheckmark, { backgroundColor: colors.primary }]}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.previewBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={{ fontSize, color: colors.text, lineHeight: fontSize * 1.7, textAlign: 'center' }}>
              For God so loved the world...
            </Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.chapterPicker} onPress={openNavigator}>
          <Text style={styles.chapterText}>
            {currentBookLabel} {currentChapter}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowParallelMode((v) => !v)}>
            <Ionicons
              name={showParallelMode ? 'book' : 'book-outline'}
              size={20}
              color={showParallelMode ? colors.primary : colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowDisplaySettings(true)}>
            <Ionicons name="text" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => setShowVersionPicker(true)}>
            <Text style={styles.versionBadge}>{versionLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chapterNavBar}>
        <TouchableOpacity
          style={[styles.navArrow, currentChapter <= 1 && styles.navArrowDisabled]}
          onPress={() => changeChapter(-1)}
          disabled={currentChapter <= 1}
        >
          <Ionicons name="chevron-back" size={18} color={currentChapter <= 1 ? colors.border : colors.primary} />
        </TouchableOpacity>
        <Text style={styles.chapterNavText}>
          {isTelugu ? `అధ్యాయం ${currentChapter} / ${maxChapters}` : `Chapter ${currentChapter} of ${maxChapters}`}
        </Text>
        <TouchableOpacity
          style={[styles.navArrow, currentChapter >= maxChapters && styles.navArrowDisabled]}
          onPress={() => changeChapter(1)}
          disabled={currentChapter >= maxChapters}
        >
          <Ionicons name="chevron-forward" size={18} color={currentChapter >= maxChapters ? colors.border : colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading chapter...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.textLight} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadChapter}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView ref={scrollRef} style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.versesContainer}>
            {verses.map((verse, index) => (
              <TouchableOpacity key={verse.id} onPress={() => handleVersePress(verse.id)} activeOpacity={0.75}>
                <View
                  style={[
                    styles.verseRow,
                    { backgroundColor: getVerseBackground(verse) },
                    selectedVerse === verse.id && styles.selectedVerseRow,
                  ]}
                >
                  <Text style={[styles.verseNumber, highlights[verse.id] && { color: colors.primary }]}>
                    {verse.number}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.verseText}>{verse.text}</Text>
                    {showParallelMode && parallelVerses[index] && (
                      <Text style={styles.parallelText}>{parallelVerses[index].text}</Text>
                    )}
                    {notes[verse.id] && (
                      <View style={styles.notePreview}>
                        <Ionicons name="create" size={11} color={colors.primary} />
                        <Text style={styles.notePreviewText} numberOfLines={1}>
                          {typeof notes[verse.id] === 'string' ? notes[verse.id] : notes[verse.id]?.note}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isBookmarked(verse.id) && <Ionicons name="bookmark" size={14} color={colors.primary} style={{ marginLeft: 4 }} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

      {showActionBar && selectedVerse && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionItem} onPress={handleNote}>
            <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => setShowHighlightPicker((v) => !v)}>
            <Ionicons name="color-fill-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Highlight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked(selectedVerse) ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={isBookmarked(selectedVerse) ? colors.primary : colors.textSecondary}
            />
            <Text style={styles.actionLabel}>{isBookmarked(selectedVerse) ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => {
              setSelectedVerse(null);
              setShowActionBar(false);
              setShowHighlightPicker(false);
            }}
          >
            <Ionicons name="close-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.actionLabel}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {showHighlightPicker && (
        <View style={styles.colorPicker}>
          {highlightColors.map((hc) => (
            <TouchableOpacity
              key={hc.id}
              style={[
                styles.colorDot,
                { backgroundColor: hc.color },
                highlights[selectedVerse] === hc.id && styles.colorDotSelected,
              ]}
              onPress={() => handleHighlight(hc.id)}
            />
          ))}
          <TouchableOpacity
            onPress={() => {
              toggleHighlight(selectedVerse);
              setShowHighlightPicker(false);
            }}
          >
            <Ionicons name="close-circle-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}


      {renderDisplaySettings()}

      <Modal visible={showNavigator} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { flex: 1 }]}>
          {renderNavHeader()}
          {navStep === STEP_BOOK && renderStepBook()}
          {navStep === STEP_CHAPTER && renderStepChapter()}
          {navStep === STEP_VERSE && <NavVerseList />}
        </SafeAreaView>
      </Modal>

      <Modal visible={showVersionPicker} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { flex: 1 }]}>
          <View style={styles.navHeader}>
            <View style={{ width: 34 }} />
            <Text style={styles.modalTitle}>Language & Version</Text>
            <TouchableOpacity onPress={() => setShowVersionPicker(false)} style={styles.navCloseBtn}>
              <Ionicons name="close" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.langRow}>
            <TouchableOpacity
              style={[styles.langBtn, bibleLanguage === 'english' && styles.langBtnActive]}
              onPress={() => setBibleLanguage('english')}
            >
              <Text style={styles.langFlag}>🇬🇧</Text>
              <Text style={[styles.langBtnText, bibleLanguage === 'english' && styles.langBtnActiveText]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langBtn, bibleLanguage === 'telugu' && styles.langBtnActive]}
              onPress={() => {
                setBibleLanguage('telugu');
                setShowVersionPicker(false);
              }}
            >
              <Text style={styles.langFlag}>🇮🇳</Text>
              <Text style={[styles.langBtnText, bibleLanguage === 'telugu' && styles.langBtnActiveText]}>తెలుగు</Text>
            </TouchableOpacity>
          </View>

          {bibleLanguage === 'english' && (
            <ScrollView>
              <Text style={styles.sectionLabel}>English Versions</Text>
              {bibleVersions.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.versionItem}
                  onPress={() => {
                    setBibleVersion(v.id);
                    setShowVersionPicker(false);
                  }}
                >
                  <View>
                    <Text
                      style={[styles.versionItemText, bibleVersion === v.id && { color: colors.primary, fontWeight: '700' }]}
                    >
                      {v.short}
                    </Text>
                    <Text style={styles.versionItemSub}>{v.name}</Text>
                  </View>
                  {bibleVersion === v.id && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>

      <Modal visible={showNoteModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { flex: 1 }]}>
          <View style={styles.navHeader}>
            <TouchableOpacity onPress={() => setShowNoteModal(false)} style={styles.navBackBtn}>
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TouchableOpacity onPress={saveNote} style={styles.navCloseBtn}>
              <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.noteInput}
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Write your note here..."
            placeholderTextColor={colors.textLight}
            multiline
            autoFocus
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const makeStyles = (colors, fontSize) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.background,
    },
    iconBtn: { padding: 6 },
    chapterPicker: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    chapterText: { fontSize: 17, fontWeight: '800', color: colors.text },
    headerRight: { flexDirection: 'row', gap: 2, alignItems: 'center' },
    versionBadge: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: 6,
      paddingHorizontal: 7,
      paddingVertical: 3,
    },
    chapterNavBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    navArrow: { padding: 6 },
    navArrowDisabled: { opacity: 0.3 },
    chapterNavText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loadingText: { color: colors.textSecondary, fontSize: 14 },
    errorText: { color: colors.textSecondary, fontSize: 14, textAlign: 'center', paddingHorizontal: 30 },
    retryBtn: { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10 },
    retryText: { color: '#fff', fontWeight: '700' },
    scroll: { flex: 1 },
    versesContainer: { padding: 20 },
    verseRow: {
      flexDirection: 'row',
      marginBottom: 14,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
    },
    selectedVerseRow: { borderWidth: 1, borderColor: colors.primary + '60' },
    verseNumber: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
      marginRight: 10,
      marginTop: 3,
      minWidth: 22,
    },
    verseText: { fontSize, lineHeight: fontSize * 1.7, color: colors.text },
    parallelText: {
      fontSize: fontSize - 2,
      lineHeight: (fontSize - 2) * 1.6,
      color: colors.textSecondary,
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      fontStyle: 'italic',
    },
    notePreview: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
    notePreviewText: { fontSize: 11, color: colors.primary, flex: 1 },
    actionBar: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingVertical: 10,
      paddingHorizontal: 14,
      backgroundColor: colors.white,
    },
    actionItem: { flex: 1, alignItems: 'center', gap: 4 },
    actionLabel: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
    colorPicker: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      paddingVertical: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    colorDot: { width: 28, height: 28, borderRadius: 14 },
    colorDotSelected: { borderWidth: 3, borderColor: colors.text },
    displayOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end',
    },
    displayPanel: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      paddingBottom: 36,
    },
    displaySectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    fontSizeRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    fontSizeBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 1,
    },
    fontSizeBtnText: { fontWeight: '600' },
    fontSliderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      marginBottom: 4,
    },
    fontAdjBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fontSliderValue: { fontSize: 18, fontWeight: '800', minWidth: 50, textAlign: 'center' },
    displayDivider: { height: 1, marginVertical: 16 },
    themeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    themeBtn: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 14,
      alignItems: 'center',
      gap: 6,
      borderWidth: 1,
      position: 'relative',
    },
    themeBtnLabel: { fontSize: 12, fontWeight: '600' },
    themeCheckmark: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 16,
      height: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    previewBox: {
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      minHeight: 60,
      justifyContent: 'center',
    },
    modal: { backgroundColor: colors.background },
    navHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    navBackBtn: { padding: 6 },
    navCloseBtn: { padding: 6 },
    modalTitle: { fontSize: 17, fontWeight: '800', color: colors.text },
    breadcrumb: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8 },
    crumb: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
    crumbActive: { color: colors.primary, fontWeight: '700' },
    modalTabRow: {
      flexDirection: 'row',
      margin: 12,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
      padding: 4,
    },
    modalTab: { flex: 1, paddingVertical: 8, borderRadius: 10, alignItems: 'center' },
    modalActiveTab: { backgroundColor: colors.primary },
    modalTabText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    modalActiveTabText: { color: '#fff' },
    bookItem: {
      flex: 1,
      margin: 4,
      padding: 10,
      borderRadius: 12,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center',
      minHeight: 60,
      justifyContent: 'center',
    },
    bookItemActive: { backgroundColor: colors.primary },
    bookItemText: { fontSize: 11, fontWeight: '700', color: colors.text, textAlign: 'center' },
    bookItemActiveText: { color: '#fff' },
    bookItemSub: { fontSize: 10, color: colors.textSecondary, marginTop: 3 },
    chapterItem: {
      flex: 1,
      margin: 5,
      aspectRatio: 1,
      borderRadius: 12,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    chapterItemActive: { backgroundColor: colors.primary },
    chapterItemText: { fontSize: 16, fontWeight: '700', color: colors.text },
    chapterItemActiveText: { color: '#fff' },
    navVerseRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginBottom: 6,
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 12,
    },
    navVerseNumWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.overlay,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    navVerseNum: { fontSize: 12, fontWeight: '800', color: colors.primary },
    navVerseText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 19 },
    langRow: { flexDirection: 'row', gap: 12, margin: 16 },
    langBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      backgroundColor: colors.surfaceSecondary,
      alignItems: 'center',
      gap: 4,
    },
    langBtnActive: { backgroundColor: colors.primary },
    langFlag: { fontSize: 22 },
    langBtnText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    langBtnActiveText: { color: '#fff' },
    sectionLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.textSecondary,
      paddingHorizontal: 20,
      paddingVertical: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    versionItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    versionItemText: { fontSize: 16, color: colors.text, fontWeight: '600' },
    versionItemSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    noteInput: {
      flex: 1,
      margin: 16,
      fontSize: 16,
      color: colors.text,
      textAlignVertical: 'top',
      lineHeight: 26,
    },
  });