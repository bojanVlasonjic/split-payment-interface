package dipl.spi.spi_backend.dto;

import dipl.spi.spi_backend.model.Article;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.stream.Collectors;

@NoArgsConstructor
@Getter
@Setter
public class ArticlePageDto {

    private int totalPages;
    private int pageNumber;
    private List<ArticleDto> articles;

}
