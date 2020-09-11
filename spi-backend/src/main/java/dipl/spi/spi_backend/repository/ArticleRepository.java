package dipl.spi.spi_backend.repository;


import dipl.spi.spi_backend.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    List<Article> findByUserIdOrderByNameAsc(Long userId, Pageable pageable);

    List<Article> findByUserIdAndNameContainingOrderByNameAsc(Long userId,
                                                              String name,
                                                              Pageable pageable);
}
